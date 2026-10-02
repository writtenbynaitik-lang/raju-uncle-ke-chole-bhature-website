#!/usr/bin/env python3
"""
Raju Uncle Ke Chole Bhature — photographic normalise + grade + export.

The photographs come from many hands: phone snaps under tube light, DSLR
still-lifes, a street stall at dusk. Left alone they look like a folder of
pictures. Two passes fix that.

  1. NORMALISE — neutralise each frame's own cast and exposure, so every
     source starts from the same place. Percentile levels on luminance, then a
     partial grey-world correction. This is the pass that does the real work.

  2. THE HOUSE GRADE — one look applied identically to all of them: warm
     daylight, blacks lifted to the brand's cocoa rather than crushed to black,
     highlights drifting to cream, saffron in the midtones, a little bloom on
     the oil, a soft vignette and fine grain.

Outputs WebP at the widths each asset is actually displayed at, and writes
src/data/images.ts plus src/data/credits.ts so a component can only ever ask
for a width that exists, and every photograph keeps its attribution.

  python3 scripts/grade.py          # download (cached), grade, export
  python3 scripts/grade.py --force  # re-grade even if outputs are current

To swap in the restaurant's own photography, drop files named after the keys in
scripts/photos.json into src-photography/ and re-run: local files win over the
downloaded ones, and the whole site re-skins to the real kitchen.
"""

import json
import os
import re
import sys
import urllib.parse
import urllib.request

from PIL import Image, ImageChops, ImageEnhance, ImageFilter

Image.MAX_IMAGE_PIXELS = 300_000_000

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(REPO, "src-photography")
OUT = os.path.join(REPO, "public", "img")
MANIFEST = os.path.join(REPO, "scripts", "photos.json")
UA = "RajuUncleConceptBuild/1.0 (site concept build; Wikimedia Commons imagery)"
FORCE = "--force" in sys.argv

# The ends of the house curve. Neither is neutral: the shadow is the brand's
# cocoa and the highlight is the paper the site is printed on.
BLACK = (26, 19, 15)
HIGHLIGHT = (255, 241, 214)


# ── helpers ──────────────────────────────────────────────────────────────────
def lut(fn):
    return [max(0, min(255, int(round(fn(i))))) for i in range(256)]


def fetch(file_name: str, dest: str, width: int = 2800) -> None:
    """Pull a capped-width render from Commons rather than a 15 MB original."""
    api = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "titles": f"File:{file_name}",
            "prop": "imageinfo",
            "iiprop": "url",
            "iiurlwidth": width,
        }
    )
    req = urllib.request.Request(api, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90) as r:
        data = json.load(r)
    page = next(iter(data["query"]["pages"].values()))
    info = page["imageinfo"][0]
    url = info.get("thumburl") or info["url"]
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=180) as r, open(dest, "wb") as f:
        f.write(r.read())


def zoom_in(im: Image.Image, zoom: float, focus) -> Image.Image:
    """Punch in on the subject, around the focus point. 1.0 is the whole frame."""
    if zoom >= 0.999:
        return im
    w, h = round(im.width * zoom), round(im.height * zoom)
    x = max(0, min(im.width - w, round((im.width - w) * focus[0])))
    y = max(0, min(im.height - h, round((im.height - h) * focus[1])))
    return im.crop((x, y, x + w, y + h))


def crop_to(im: Image.Image, aspect, focus) -> Image.Image:
    """Crop to an aspect ratio around a focus point, never upscaling."""
    tw, th = aspect
    want = tw / th
    have = im.width / im.height
    if abs(want - have) < 0.005:
        return im
    if have > want:  # too wide — trim the sides
        w = round(im.height * want)
        x = round((im.width - w) * focus[0])
        x = max(0, min(im.width - w, x))
        return im.crop((x, 0, x + w, im.height))
    h = round(im.width / want)  # too tall — trim top and bottom
    y = round((im.height - h) * focus[1])
    y = max(0, min(im.height - h, y))
    return im.crop((0, y, im.width, y + h))


# ── pass 1: normalise ────────────────────────────────────────────────────────
def normalise(im: Image.Image, cast=0.66, levels=1.0, warmbias=True) -> Image.Image:
    """
    Take each frame's own cast and exposure out, so the house grade lands the
    same way on a flash-lit snap and a window-lit still life.
    """
    im = im.convert("RGB")
    small = im.resize((256, 256), Image.BILINEAR)  # statistics only

    # -- exposure: stretch luminance between its 0.4 and 99.6 percentiles.
    lum = small.convert("L")
    hist = lum.histogram()
    total = sum(hist)
    lo_t, hi_t = total * 0.004, total * 0.996
    run, lo, hi = 0, 0, 255
    for v, c in enumerate(hist):
        run += c
        if run <= lo_t:
            lo = v
        if run <= hi_t:
            hi = v
    lo, hi = max(0, lo), min(255, max(hi, lo + 32))
    span = hi - lo
    if span < 250:
        gain = 255.0 / span
        blend = levels
        stretch = lut(lambda i: i * (1 - blend) + ((i - lo) * gain) * blend)
        im = im.point(stretch * 3)
        small = im.resize((256, 256), Image.BILINEAR)

    # -- cast: pull the channel means toward each other, partially. Full
    #    grey-world would strip the food of its warmth, so this stops at ~60%.
    r, g, b = small.split()
    means = [
        sum(i * c for i, c in enumerate(ch.histogram())) / max(1, sum(ch.histogram()))
        for ch in (r, g, b)
    ]
    target = sum(means) / 3
    if target > 1:
        fr, fg, fb = (1 + (target / max(1.0, m) - 1) * cast for m in means)
        # Keep a deliberate warm bias: this food should never read cold.
        if warmbias:
            fr, fb = fr * 1.03, fb * 0.975
        cr, cg, cb = im.split()
        im = Image.merge(
            "RGB",
            (
                cr.point(lut(lambda i, f=fr: i * f)),
                cg.point(lut(lambda i, f=fg: i * f)),
                cb.point(lut(lambda i, f=fb: i * f)),
            ),
        )
    return im


# ── pass 2: the house grade ──────────────────────────────────────────────────
def _warm_ramp():
    """Cocoa shadow, saffron midtone, cream highlight."""
    stops = [
        (0, BLACK),
        (78, (86, 55, 34)),
        (150, (188, 124, 58)),
        (210, (240, 194, 132)),
        (255, HIGHLIGHT),
    ]
    ramp = []
    for i in range(256):
        for a, b in zip(stops, stops[1:]):
            if a[0] <= i <= b[0]:
                t = (i - a[0]) / (b[0] - a[0])
                ramp.append(tuple(round(a[1][c] + (b[1][c] - a[1][c]) * t) for c in range(3)))
                break
    return ramp


RAMP = _warm_ramp()


def s_curve(strength=0.16):
    """A soft filmic contrast curve — no clipping at either end."""
    import math

    def f(i):
        x = i / 255.0
        y = x + strength * math.sin(2 * math.pi * x) * -0.5
        y = min(1.0, max(0.0, y))
        return y * 255

    return lut(f)


def grade(
    im: Image.Image,
    sat=1.15,
    warm=0.15,
    bloom=0.14,
    vig=0.10,
    grain=3,
    sharpen=0.5,
    lift=0.055,
    bright=1.05,
) -> Image.Image:
    """The house look. Every parameter is a dial, not a switch."""
    im = im.convert("RGB")

    # 1 — tone: a gentle S-curve, a little more light, a little more colour.
    #     The curve stays shallow: food photographed under tube light goes
    #     muddy the moment the shadows are pushed.
    im = im.point(s_curve(0.11) * 3)
    im = ImageEnhance.Brightness(im).enhance(bright)
    im = ImageEnhance.Color(im).enhance(sat)

    # 2 — the warm ramp, blended over rather than replacing, so the ramp tints
    #     the frame instead of posterising it.
    lum = im.convert("L")
    tinted = Image.merge(
        "RGB",
        (
            lum.point([RAMP[i][0] for i in range(256)]),
            lum.point([RAMP[i][1] for i in range(256)]),
            lum.point([RAMP[i][2] for i in range(256)]),
        ),
    )
    im = Image.blend(im, tinted, warm)

    # 3 — bloom: the sheen on hot oil. Screen a blurred highlight pass back in.
    if bloom > 0:
        hi = im.point(lut(lambda i: 0 if i < 168 else (i - 168) * 2.9) * 3)
        hi = hi.filter(ImageFilter.GaussianBlur(radius=max(im.size) / 90))
        im = ImageChops.screen(im, ImageChops.multiply(hi, Image.new("RGB", im.size, (int(255 * bloom),) * 3)))

    # 4 — the black point never reaches zero; it lands on the brand's cocoa.
    #     One remap only — lighter() on top of it flattened the shadows.
    im = Image.merge(
        "RGB",
        [
            ch.point(lut(lambda i, b=BLACK[c]: b + i * (255 - b) / 255))
            for c, ch in enumerate(im.split())
        ],
    )

    # 4b — a breath of the page's own cream screened over the whole frame, so
    #      the photographs sit on the paper instead of on top of it.
    if lift > 0:
        paper = Image.new("RGB", im.size, (247, 241, 229))
        im = Image.blend(im, ImageChops.screen(im, paper), lift)

    # 5 — vignette: a radial falloff, computed once at low res and scaled up.
    if vig > 0:
        w, h = im.size
        mask = Image.new("L", (128, 128), 0)
        px = mask.load()
        for y in range(128):
            for x in range(128):
                dx, dy = (x - 63.5) / 63.5, (y - 63.5) / 63.5
                d = min(1.0, (dx * dx + dy * dy) ** 0.5 / 1.42)
                px[x, y] = int(255 * (1 - (d**3.0) * vig))
        mask = mask.resize((w, h), Image.BICUBIC)
        im = ImageChops.multiply(im, Image.merge("RGB", (mask, mask, mask)))

    # 6 — grain, so the set reads as film rather than as twenty-five uploads.
    if grain > 0:
        w, h = im.size
        noise = Image.effect_noise((w, h), grain).convert("L")
        noise = ImageChops.offset(noise, 0, 0)
        im = ImageChops.blend(im, ImageChops.overlay(im, Image.merge("RGB", (noise,) * 3)), 0.05)

    # 7 — texture: the crust on the bhatura has to stay crisp after resizing.
    if sharpen > 0:
        im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=int(90 * sharpen), threshold=3))

    return im


# ── export ───────────────────────────────────────────────────────────────────
def main() -> int:
    os.makedirs(CACHE, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    manifest = json.load(open(MANIFEST, encoding="utf-8"))

    assets, credits = {}, []
    for key, spec in manifest.items():
        # A local override always wins, so real photography can replace ours.
        local = next(
            (
                p
                for p in (os.path.join(CACHE, f"{key}{e}") for e in (".jpg", ".jpeg", ".png", ".webp", ".JPG"))
                if os.path.exists(p)
            ),
            None,
        )
        src = local or os.path.join(CACHE, "_commons_" + spec["file"].replace("/", "_"))
        if not local and not os.path.exists(src):
            print(f"  ↓ {key}")
            fetch(spec["file"], src)

        newest_out = os.path.join(OUT, f"{key}-{spec['widths'][-1]}.webp")
        if not FORCE and os.path.exists(newest_out) and os.path.getmtime(newest_out) > os.path.getmtime(src):
            im = Image.open(src)
            cropped = crop_to(
                zoom_in(im, spec.get("zoom", 1.0), spec["focus"]),
                spec["aspect"], spec["focus"])
            widths = [w for w in spec["widths"] if w <= cropped.width] or [cropped.width]
            assets[key] = {"widths": widths, "width": cropped.width, "height": cropped.height}
        else:
            im = Image.open(src)
            im = crop_to(zoom_in(im, spec.get("zoom", 1.0), spec["focus"]),
                         spec["aspect"], spec["focus"])
            im = normalise(im, **spec.get("norm", {}))
            im = grade(im, **spec.get("grade", {}))

            widths = [w for w in spec["widths"] if w <= im.width] or [im.width]
            for w in widths:
                h = round(im.height * w / im.width)
                im.resize((w, h), Image.LANCZOS).save(
                    os.path.join(OUT, f"{key}-{w}.webp"), "WEBP", quality=82, method=6
                )
            assets[key] = {"widths": widths, "width": im.width, "height": im.height}
            print(f"  ✓ {key:18s} {im.width}x{im.height}  {widths}")

        s = spec["source"]
        # Commons Artist fields sometimes trail a licence blurb; keep the name.
        author = re.sub(r"\s+", " ", str(s["author"]).split("\n")[0]).strip()
        author = re.split(r"\s*(?:This work|This file|Attribution)", author)[0].strip(" ,;\u00b7-")
        credits.append(
            {
                "key": key,
                "title": spec["file"].rsplit(".", 1)[0],
                "author": author,
                "licence": s["licence"],
                "licenceUrl": s["licenceUrl"],
                "page": s["page"],
            }
        )

    order = list(manifest.keys())
    body = ",\n".join(
        f'  "{k}": {{ widths: {assets[k]["widths"]}, width: {assets[k]["width"]}, height: {assets[k]["height"]} }}'
        for k in order
    )
    with open(os.path.join(REPO, "src", "data", "images.ts"), "w", encoding="utf-8") as f:
        f.write(
            "/**\n"
            " * Generated by scripts/grade.py — do not edit by hand.\n"
            " *\n"
            " * `widths` is what actually exists in /public/img. Sources are never\n"
            " * upscaled, so a small source simply yields fewer steps rather than a\n"
            " * srcset entry that 404s.\n"
            " */\n\n"
            "export interface ImageAsset {\n"
            "  /** Widths present on disk, ascending. */\n  widths: number[];\n"
            "  /** Intrinsic size of the largest, for aspect-ratio reservation. */\n"
            "  width: number;\n  height: number;\n}\n\n"
            "export const images = {\n" + body + ",\n} as const satisfies Record<string, ImageAsset>;\n\n"
            "export type ImageKey = keyof typeof images;\n"
        )

    with open(os.path.join(REPO, "src", "data", "credits.ts"), "w", encoding="utf-8") as f:
        f.write(
            "/**\n"
            " * Generated by scripts/grade.py — do not edit by hand.\n"
            " *\n"
            " * Every photograph on this concept is an openly-licensed image from\n"
            " * Wikimedia Commons, graded to one look. They stand in for the\n"
            " * restaurant's own food photography and are credited here in full.\n"
            " */\n\n"
            "export interface Credit {\n  key: string;\n  title: string;\n  author: string;\n"
            "  licence: string;\n  licenceUrl: string;\n  page: string;\n}\n\n"
            "export const credits: Credit[] = " + json.dumps(credits, indent=2, ensure_ascii=False) + ";\n"
        )

    # The hero is the LCP element, and it is art-directed, so the preload has to
    # carry the same srcset/sizes/media the markup uses. Generating it here means
    # it can never drift from the widths that exist on disk.
    def preload(key, sizes, media):
        a = assets[key]
        srcset = ", ".join(f"/img/{key}-{w}.webp {w}w" for w in a["widths"])
        return (
            f'    <link rel="preload" as="image" href="/img/{key}-{a["widths"][-1]}.webp"\n'
            f'      imagesrcset="{srcset}"\n'
            f'      imagesizes="{sizes}" media="{media}" />'
        )

    html_path = os.path.join(REPO, "index.html")
    html = open(html_path, encoding="utf-8").read()
    start, end = "<!-- hero-preload:start -->", "<!-- hero-preload:end -->"
    if start in html and end in html:
        block = "\n".join(
            [
                start,
                "    <!-- Generated by scripts/grade.py — do not edit by hand. -->",
                preload("hero-plate", "92vw", "(max-width: 59.999rem)"),
                preload("hero-plate-p", "42vw", "(min-width: 60rem)"),
                "    " + end,
            ]
        )
        html = html[: html.index(start)] + block + html[html.index(end) + len(end) :]
        open(html_path, "w", encoding="utf-8").write(html)
        print("  ✓ hero preload written into index.html")

    total = sum(
        os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT) if f.endswith(".webp")
    )
    print(f"\n{len(assets)} assets · {len(os.listdir(OUT))} files · {total / 1024:.0f} KB total")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

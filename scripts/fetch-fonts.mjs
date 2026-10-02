/**
 * Pulls the exact woff2 subsets the site uses from Google Fonts into public/fonts.
 * Latin for everything; Devanagari only for the two faces that set Hindi words.
 * Self-hosted so the page makes no third-party request at runtime.
 */
import { writeFile, mkdir } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const LATIN = "U+0000-00FF";
const DEVA = "U+0900-097F";

const WANT = [
  { file: "khand-600.woff2", family: "Khand:wght@600", range: LATIN },
  { file: "khand-700.woff2", family: "Khand:wght@700", range: LATIN },
  { file: "khand-700-deva.woff2", family: "Khand:wght@700", range: DEVA },
  { file: "inter-var.woff2", family: "Inter:wght@400..700", range: LATIN },
  { file: "rozha-one.woff2", family: "Rozha+One", range: LATIN },
  { file: "rozha-one-deva.woff2", family: "Rozha+One", range: DEVA },
];

await mkdir("public/fonts", { recursive: true });

for (const { file, family, range } of WANT) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}&display=swap`,
    { headers: { "User-Agent": UA } },
  ).then((r) => r.text());

  // Walk @font-face blocks and keep the one whose unicode-range starts with the
  // subset we asked for.
  const blocks = css.split("@font-face").slice(1);
  const hit = blocks.find((b) => b.includes(`unicode-range: ${range}`));
  if (!hit) {
    console.error(`!! no ${range} block for ${family}`);
    continue;
  }
  const url = hit.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  if (!url) {
    console.error(`!! no woff2 url for ${family}`);
    continue;
  }
  const buf = Buffer.from(
    await fetch(url, { headers: { "User-Agent": UA } }).then((r) =>
      r.arrayBuffer(),
    ),
  );
  await writeFile(`public/fonts/${file}`, buf);
  console.log(`${file.padEnd(22)} ${String(Math.round(buf.length / 1024)).padStart(4)} KB  ${url.split("/").pop()}`);
}

/* ── Devanagari is used for exactly five short phrases, so the two Hindi faces
      are cut down to those glyphs. 158 KB of full Devanagari becomes ~10 KB. ── */
import subsetFont from "subset-font";
import { readFile } from "node:fs/promises";

const HINDI = "राजू अंकल के छोले भटूरे गरम लस्सी समोसा ठंडी";
for (const file of ["khand-700-deva.woff2", "rozha-one-deva.woff2"]) {
  const before = await readFile(`public/fonts/${file}`);
  const after = await subsetFont(before, HINDI, {
    targetFormat: "woff2",
    // Keep the shaping tables: Devanagari needs them to form conjuncts.
    preserveNameIds: [],
  });
  await writeFile(`public/fonts/${file}`, after);
  console.log(
    `subset ${file.padEnd(22)} ${Math.round(before.length / 1024)} KB -> ${Math.round(after.length / 1024)} KB`,
  );
}

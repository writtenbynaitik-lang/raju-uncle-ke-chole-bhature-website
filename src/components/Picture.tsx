import { images, type ImageKey } from "../data/images";

interface ArtSource {
  name: ImageKey;
  /** Media query under which this crop should win. */
  media: string;
}

interface Props {
  name: ImageKey;
  alt: string;
  /** What the image will actually occupy, so the browser can pick a width. */
  sizes: string;
  className?: string;
  /** Set on the hero only: it is the LCP element and must not be deferred. */
  priority?: boolean;
  /** Overrides the intrinsic ratio when the frame crops the photograph. */
  ratio?: string;
  /**
   * Alternate crops of the same subject. Used where a portrait frame and a
   * landscape frame need genuinely different compositions rather than the same
   * file squeezed by object-fit.
   */
  art?: ArtSource[];
}

function srcSetFor(name: ImageKey) {
  return images[name].widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(", ");
}

/**
 * One <img> with a real srcset, its intrinsic ratio reserved so nothing shifts
 * while it loads. Every width offered is one the pipeline actually wrote.
 */
export function Picture({
  name,
  alt,
  sizes,
  className = "",
  priority,
  ratio,
  art,
}: Props) {
  const asset = images[name];
  const fallback = asset.widths[asset.widths.length - 1];

  const img = (
    <img
      className={`pic ${className}`.trim()}
      src={`/img/${name}-${fallback}.webp`}
      srcSet={srcSetFor(name)}
      sizes={sizes}
      width={asset.width}
      height={asset.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      style={ratio ? { aspectRatio: ratio } : undefined}
    />
  );

  if (!art?.length) return img;

  return (
    <picture>
      {art.map((a) => (
        <source
          key={a.name + a.media}
          media={a.media}
          srcSet={srcSetFor(a.name)}
          sizes={sizes}
          width={images[a.name].width}
          height={images[a.name].height}
        />
      ))}
      {img}
    </picture>
  );
}

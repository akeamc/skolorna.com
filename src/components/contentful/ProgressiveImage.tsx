import { Asset } from "contentful";
import React, { FunctionComponent } from "react";
import { usePlaceholder } from "../../lib/contentful/placeholder";

export interface Props {
  asset: Asset;
  sizes?: number[];
}

export function normalizeAssetUrl(asset: Asset): string {
  const url = new URL(`https:${asset.fields.file.url}`);
  url.hostname = "images.ctfassets.net";
  return url.href;
}

type Format = "jpeg" | "png" | "webp";

function srcSet(base: string, format: Format, sizes: number[]): string {
  return sizes
    .map((size) => `${base}?w=${size}&fm=${format} ${size}w`)
    .join(", ");
}

export const ProgressiveImage: FunctionComponent<Props> = ({
  asset,
  sizes = [200, 540, 768, 1024, 1400],
}) => {
  const { title, file, description } = asset.fields;
  const placeholder = usePlaceholder(asset.sys.id);
  const base = normalizeAssetUrl(asset);

  return (
    <picture>
      <style jsx>{`
        picture {
          display: block;
          width: 100%;
          height: 100%;
          background-image: url(${placeholder});
          background-size: cover;
          background-position: center;
        }

        img {
          width: 100%;
          aspect-ratio: ${file.details.image?.width} /
            ${file.details.image?.height};
        }
      `}</style>
      <source srcSet={srcSet(base, "webp", sizes)} type="image/webp" />
      <source srcSet={srcSet(base, "jpeg", sizes)} type="image/jpeg" />
      <img
        src={`${base}?w=400`}
        alt={description}
        title={title}
        loading="lazy"
      />
    </picture>
  );
};

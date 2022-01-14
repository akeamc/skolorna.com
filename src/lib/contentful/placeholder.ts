import { BLOCKS } from "@contentful/rich-text-types";
import { Asset, EntryFields } from "contentful";
import { createContext, useContext } from "react";

export async function generatePlaceholder(asset: Asset) {
  const url = new URL(`https:${asset.fields.file.url}`);
  // Oversized assets point to downloads.ctfassets.net which doesn't allow manipulation
  url.hostname = "images.ctfassets.net";
  url.searchParams.append("fm", "jpg");
  url.searchParams.append("w", "4");

  const res = await fetch(url.href);

  if (!res.ok) {
    throw new Error(`Could not fetch lowres for ${asset.fields.file.url}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());

  return `data:${res.headers.get("content-type")};base64,${buf.toString(
    "base64"
  )}`;
}

/**
 * An object mapping asset ids to base64-encoded low resolution images.
 */
export type PlaceholderTable = Record<string, string>;

export const PlaceholderContext = createContext<PlaceholderTable>({});

export const usePlaceholder = (key: string): string | undefined => {
  const lut = useContext(PlaceholderContext);

  return lut[key];
};

export async function generatePlaceholders(
  assets: Asset[]
): Promise<PlaceholderTable> {
  const placeholders = Object.fromEntries(
    await Promise.all(
      assets.map((asset) =>
        generatePlaceholder(asset as any).then((b64) => [asset?.sys.id, b64])
      )
    )
  );

  return placeholders;
}

/**
 * Extract all assets from a rich text field.
 */
export function extractAssets(content: EntryFields.RichText): Asset[] {
  const assets = content.content
    .filter(({ nodeType }) => (nodeType as any) === BLOCKS.EMBEDDED_ASSET)
    .map((node) => node.data.target as any);

  return assets;
}

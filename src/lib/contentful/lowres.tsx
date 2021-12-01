import { Asset } from "contentful";

export const blobToDataUri = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
  });

export async function lowres(asset: Asset) {
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

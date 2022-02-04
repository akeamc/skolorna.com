import { Asset, Entry, EntryFields } from "contentful";
import { client } from "../utils/contentful";

export const CONTENTFUL_TYPE = "digibruh";

export interface EncyclopediaArticle {
  title: EntryFields.Text;
  slug: EntryFields.Text;
  description: EntryFields.Text;
  cover: Asset;
  content: EntryFields.RichText;
}

export async function listEncyclopediaArticles(): Promise<
  Entry<EncyclopediaArticle>[]
> {
  const res = await client.getEntries<EncyclopediaArticle>({
    content_type: CONTENTFUL_TYPE,
    order: "-sys.createdAt",
  });
  return res.items;
}

export async function getEncyclopediaArticle(
  slug: string
): Promise<Entry<EncyclopediaArticle>> {
  const res = await client.getEntries<EncyclopediaArticle>({
    content_type: CONTENTFUL_TYPE,
    "fields.slug": slug,
  });
  if (res.items.length !== 1) {
    throw new Error("article not found");
  }
  return res.items[0];
}

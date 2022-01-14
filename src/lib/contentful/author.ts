import { Asset, EntryFields } from "contentful";

/**
 * Author from the CMS, not necessarily of the blog.
 */
export interface Author {
  name: EntryFields.Text;
  slug: EntryFields.Text;
  bio: EntryFields.Text;
  avatar: Asset;
}

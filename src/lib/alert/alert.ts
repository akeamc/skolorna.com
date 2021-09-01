import { Entry, EntryFields } from "contentful";
import { client } from "../utils/contentful";

export interface Alert {
  content: EntryFields.RichText;
}

export async function listAlerts(): Promise<Entry<Alert>[]> {
  const res = await client.getEntries<Alert>({ content_type: "alert" });
  return res.items;
}

import { createClient } from "contentful";

const {
  NEXT_PUBLIC_CONTENTFUL_SPACE_ID: SPACE_ID = "",
  CONTENTFUL_PREVIEW_TOKEN: PREVIEW_TOKEN = "",
  NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN: ACCESS_TOKEN = "",
} = process.env;

export const client = createClient({
  accessToken: ACCESS_TOKEN,
  space: SPACE_ID,
});

export const previewClient = createClient({
  accessToken: PREVIEW_TOKEN,
  space: SPACE_ID,
  host: "preview.contentful.com",
});

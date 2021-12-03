import { NextApiHandler } from "next";
import { getPreviewBlogPost } from "../../lib/blog/post";

const { PREVIEW_SECRET } = process.env;

// eslint-disable-next-line consistent-return
const handler: NextApiHandler = async (req, res) => {
  if (!PREVIEW_SECRET) {
    return res.status(500).send("preview unavailable");
  }

  if (req.query.secret !== PREVIEW_SECRET || !req.query.slug) {
    return res.status(401).send("unauthorized");
  }

  const post = await getPreviewBlogPost(req.query.slug.toString());

  if (!post) {
    return res.status(400).send("invalid slug");
  }

  res.setPreviewData({});

  res.redirect(`/blogg/${post.fields.slug}`);
};

export default handler;

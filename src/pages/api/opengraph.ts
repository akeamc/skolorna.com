import { NextApiHandler } from "next";
import playwright from "playwright-aws-lambda";
import { fetchMenu } from "../../lib/menu-proxy/menu";

async function compilePage(menu: string) {
  const data = await fetchMenu(menu);

  const maxLength = 64;
  const title =
    data.title.length > maxLength
      ? `${data.title.substring(0, maxLength)}...`
      : data.title;

  return `
		<html>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com">
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
				<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
				<style>
					body {
						margin: 0;
					}
					
					h1 {
						font: 500 80px/1.1 "Space Grotesk", sans-serif;
						letter-spacing: -0.022em;
						margin: 0;
						overflow-wrap: break-word;
						position: absolute;
						top: 80px;
						left: 80px;
						right: 80px;
					}

					.logo {
						font: 500 40px/1 "Space Grotesk", sans-serif;
						letter-spacing: -0.01em;
						color: #666;
						position: fixed;
						bottom: 80px;
						right: 80px;
					}
				</style>
			</head>
			<body>
				<h1>${title}</h1>
				<span class="logo">Skolorna</span>
			</body>
		</html>
	`;
}

const handler: NextApiHandler = async (req, res) => {
  const menu = req.query.m.toString();
  let content: string;
  try {
    content = await compilePage(menu);
  } catch (error) {
    return res.status(404).send("menu not found");
  }

	const browser = await playwright.launchChromium();
	const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({
    width: 1200,
    height: 600,
  });
  await page.setContent(content);
  // Instead of waiting for all network connections to close (networkidle0),
  // just wait for the fonts to load (since that is the only thing we care about).
  await page.evaluateHandle("document.fonts.ready");
  const data = await page.screenshot();

  res.setHeader("cache-control", "max-age=86400");
  res.setHeader("content-type", "image/png");
  return res.send(data);
};

export default handler;

import { test, expect } from "@playwright/test";

test("menu search works", async ({ page }) => {
	await page.goto("/");
	await page.waitForLoadState("networkidle");

	const search = page.getByRole("searchbox");
	await search.type("södra latin");

	await (await page.locator("text=Södra Latin").first()).click();
	await page.waitForNavigation();

	expect(await page.textContent("h1")).toBe("Södra Latins gymnasium, Fraiche Catering");
});

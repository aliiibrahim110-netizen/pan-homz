import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.argv[2] || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1080 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.route("https://cdn.shopify.com/**", (route) => route.abort());
  await page.goto(base);
  await page.locator("h1").waitFor();
  assert.match(await page.locator("h1").innerText(), /بيتك يستاهل/);
  await page.goto(base + "/collections/all");
  await page.locator(".product-card").last().waitFor();
  assert.equal(await page.locator(".product-card").count(), 7);
  for (const image of await page.locator(".product-picture").all())
    await image.scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll(".product-picture img")).length ===
        7 &&
      Array.from(document.querySelectorAll(".product-picture img")).every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
  );
  assert.deepEqual(errors, []);
  console.log(
    "Functional smoke passed: Arabic homepage, seven catalog products, seven locally cached images, no console errors.",
  );
} finally {
  await browser.close();
}

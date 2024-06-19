import recipeLinks from "./trueLinks.json" assert { type: "json" };
import puppeteer from "puppeteer";
// This URL changes everytime you launch chrome in debug mode from the command line
// Shout out to: https://medium.com/@jaredpotter1/connecting-puppeteer-to-existing-chrome-window-8a10828149e0
const wsChromeEndpointurl =
  "ws://127.0.0.1:9222/devtools/browser/6ddaa225-8155-401c-9782-62eef26be107";
const browser = await puppeteer.connect({
  browserWSEndpoint: wsChromeEndpointurl,
});

const page = await browser.newPage();
// navigate to recipe book
await page.goto("https://www.umami.recipes/home");
await page.goto("https://www.umami.recipes/recipe-book/MwZGfJxXcRTCwqFCPrre");

for (const link of recipeLinks) {
  try {
    // Add recipe
    const newRecipeLink = await page.waitForSelector(
      'a[href="/recipe-book/MwZGfJxXcRTCwqFCPrre?addRecipe=true"]',
    );
    await newRecipeLink.click();
    const byUrlLink = await page.waitForSelector(
      "button::-p-text(Enter Recipe URL)",
    );
    await byUrlLink.click();
    const input = await page.waitForSelector("form input");
    await input.type(link);
    await page.locator("form button").click();
    await page.waitForNavigation();
    await page.waitForResponse((response) =>
      response.url().includes("/recipe/"),
    ); // wait for the browser to navigate to the recipe page

    const recipeTitle = await page.waitForSelector("h1");
    const titleText = await recipeTitle.evaluate((e) => e.innerText);
    console.log(`imported ${titleText}!`);
    await page.goBack(); // Go back to recipe book and do it again!
  } catch (err) {
    console.log(`failed to import ${link}.`);
  }
}

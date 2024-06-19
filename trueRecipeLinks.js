import fs from "fs";
import puppeteer from "puppeteer";
import recipeLinks from "./recipeLinks.json" assert { type: "json" };

// Launch the browser and open a new blank page
const browser = await puppeteer.launch({
  // headless: false,
  // slowMo: 250, // slow down by 250ms
});

const trueURL = [];
for (const link of recipeLinks) {
  const page = await browser.newPage();
  await page.goto(link);

  // We have to try a couple of different checks here, as samsung doesn't always load the full original recipe page
  // If the data was loaded in Samsung's container, grab the url from the data attr
  const dataFrame = await page.waitForSelector(".s39241").catch(() => {}); // Don't really need to do anything with this if it fails
  if (dataFrame) {
    const dataUrl = await dataFrame.evaluate((e) => e.data);
    console.log(`Adding link, ${dataUrl} to list via data attribute`);
    trueURL.push(dataUrl);
  }

  // Otherwise, just grab the URL
  if (!dataFrame) {
    const currentUrl = page.url();
    console.log(`Adding link, ${currentUrl} to list via URL`);
    trueURL.push(currentUrl);
  }

  await page.close();
}

await browser.close();

fs.writeFile("trueLinks.json", JSON.stringify(trueURL), (err) => {
  if (err) throw err;
  console.log("File written successfully");
});

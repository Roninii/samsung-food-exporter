import fs from "fs";
import puppeteer from "puppeteer";
import recipeLinks from "./recipeLinks.json" assert { type: "json" };

// Launch the browser and open a new blank page
const browser = await puppeteer.launch({
  headless: false,
  slowMo: 250, // slow down by 250ms
});

const page = await browser.newPage();
await page.goto(recipeLinks[1]);

// TODO: Refactor into loop
const trueURL = [];
// We have to try a couple of different checks here, as samsung doesn't always load the full original recipe page
const dataFrame = await page.waitForSelector(".s39241").catch(() => {
  console.log("no iframe data loaded.");
});

// If the data was loaded in Samsung's container, grab the url from the data attr
if (dataFrame) {
  trueURL.push(await page.$eval(".s39241", (e) => e.data));
}

// Otherwise, just grab the URL
if (!dataFrame) {
  const currentUrl = page.url();
  trueURL.push(currentUrl);
}

// await page.click(".s40084 a");
// await page.waitForNavigation();
// const currentUrl = page.url();
// console.log(currentUrl);

await browser.close();

fs.writeFile("trueLinks.json", JSON.stringify(trueURL), (err) => {
  if (err) throw err;
  console.log("File written successfully");
});

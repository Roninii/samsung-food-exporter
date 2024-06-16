import { RECIPE_LINKS } from "./recipeLinks.js";
import fs from "fs";
import puppeteer from "puppeteer";

// Launch the browser and open a new blank page
const browser = await puppeteer.launch({
  // headless: false,
  // slowMo: 250, // slow down by 250ms
});

const originalRecipeLinks = [];
const noLink = []; // Recipes without original links (probably manually created)
const getLink = async (pageLink) => {
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto(pageLink);

  // Set screen size.
  await page.setViewport({ width: 1080, height: 1024 });

  // Wait for recipe to load.
  const textSelector = "h1[data-testid=desktop-saved-recipe-name]";
  const heading = await page.waitForSelector(textSelector);
  const fullTitle = await heading?.evaluate((el) => el.textContent);
  console.log(`Fetching original recipe link for ${fullTitle}`);

  // Get original link
  try {
    const recipeLinkSelector = ".s40084 a";
    await page.waitForSelector(recipeLinkSelector);
    const recipeLink = await page.$eval(recipeLinkSelector, (e) => e.href);

    if (recipeLink.includes("profile")) {
      console.log("recipe has no original link");
      noLink.push(fullTitle);
      return;
    }

    console.log(`Adding link for ${fullTitle} to list!`);
    originalRecipeLinks.push(recipeLink);
  } catch {
    console.log(`Could not find original link for ${fullTitle}`);
  } finally {
    page.close();
    console.log("");
  }
};

for (const pageLink of RECIPE_LINKS) {
  await getLink(pageLink);
}
console.log(originalRecipeLinks);
// Locate the full title

// // Locate the ingredients
// await page.waitForSelector('::-p-text("Ingredients")~div a');
// const ingredients = await page.$$eval(
//   '::-p-text("Ingredients")~div a',
//   (elements) => elements.map((e) => e.textContent),
// );

// Print
// console.log('The title of this recipe is "%s".', fullTitle);
// console.log("The ingredients are:");
// ingredients.forEach((ingredient) => {
//   console.log(ingredient);
// });

await browser.close();

fs.writeFile("recipeLinks.json", JSON.stringify(originalRecipeLinks), (err) => {
  if (err) throw err;
  console.log("File written successfully");
});
fs.writeFile("userCreatedRecipes.json", JSON.stringify(noLink), (err) => {
  if (err) throw err;
  console.log("File written successfully");
});

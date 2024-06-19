# Samsung Food -> Umami

This is collection of files is the product of my desire to move off of the Samsung Food app, as my happiness began to tank ever since Samsung purchased Whisk.
I found a new recipe app that I enjoy, and rather than move all my recipes over by hand (which Samsung makes incredibly difficult anyway), I decided to write a series of scripts.

## Index.js

This is where my experiment began. I kind of went in, not really knowing what to expect. I initially was just going to scrape the name, ingredients, and instructions from each recipe.

However, Umami does not support any bulk imports, so I quickly changed course. I decided instead to go to each recipe, get it's "source link" (the link to the recipe on the creator's domain).

This went fairly well, with the only initial issue being that some of the recipes were created by me, on the app, and so the like was just to my profile. So all I did was write to two files, one for the source links, and then another that only contains the names of the recipes I created and need to deal with separately.

## trueRecipeLinks.js

Unfortunately, I learned that all the links I had just scraped often had samsung wrapper still. So, the next step was to go through all of these links, and determine if it was being loaded in a `div` on Samsung's page via a data attribute, or if it was loading the _actual_ source page. If the former, I just grabbed the `div` by it's unique class, `.s39241`. Luckily, this was consistent across the app, which made automation much simpler. If the latter were true, and it loaded the real source recipe page, then I just simply nabbed the current URL.

Since I was doing this all piece by piece, I again wrote these all to another file. Which brings us to the finale.

## importToUmami.js

I was a bit worried about this part, as I had signed up for the app via apple, and there didn't appear to be a way to add a user/pass credential alternative to the same account. I also wasn't really in the mood to figure out how I was going to reliably get through the apple login process via automation, especially with 2FA, so I went looking for an alternative. A way to manually  handle _some_ parts of the process. I stumbled upon [this article](https://medium.com/@jaredpotter1/connecting-puppeteer-to-existing-chrome-window-8) with some google-foo, and realized connecting to a running instance of Chrome was a perfect solution.

Initially, I wrote this script with a section that simply waited indefinitely for a certain selector before the code continued. This "pause" would be while I'm performing this necessary login.  Turns out that part wasn't needed, as if I leave the instance of chrome running, then it keeps that auth state alive, allowing me to login once and not think about it again!

With that out of the way, it was as easy as finding the elements I would need to click on, looping through my list of links, and flying through the import flow!

I did forget to close the browser at the end though...

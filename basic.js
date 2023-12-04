import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 639,
    deviceScaleFactor: 1,
    mobile: false,
    hasTouch: false,
    isLandscape: true,
  });


//   await page.setGeolocation({ latitude: 48.858370, longitude: 2.294481 });
//   await page.goto('https://www.google.com/maps/@48.858370,2.294481,15z');


  await page.goto('https://www.instagram.com');
  await page.waitForNetworkIdle();

  // await page.screenshot({ path: 'screenshot.png' });

 await page.type("input[name='username']","YourUsername", {delay: 100});
 await page.type("input[name='password']","YourPassword", {delay: 100});

 await Promise.all([
  page.waitForNavigation({waitUntil: "networkidle2"}), //linktochange
  await page.click("button[type='submit']"),
 ]);

 await page.click("svg[aria-label='Search']");
 await page.type("input[placeholder='Search']","john cena");

 await page.waitForSelector(".xqeqjp1 .xa49m3k");
 
//  await page.waitForTimeout(3000);
 await page.keyboard.press('ArrowDown');
 await page.keyboard.press('Enter');

 await page.waitForTimeout(4000);

 await page.waitForSelector('article > div');


 await page.click('article > div:first-child a');   // Click on the first post

 // Wait for the post to load
 await page.waitForSelector('span [aria-label="Like"]');

 // Likes the first 10 posts
 for (let i = 0; i < 10; i++) {
   await page.click('span [aria-label="Like"]');
   
   // Wait for a short time before liking the next post
   await page.waitForTimeout(1000);
   
   // Next post
   await page.keyboard.press('ArrowRight');
   
   // Wait for the next post to load
   page.waitForNavigation({waitUntil: "networkidle2"});
 }

 

  await browser.close();
})();

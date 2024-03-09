import puppeteer from "puppeteer";
import dotenv from 'dotenv';

dotenv.config();

const instagramUsernameSelector = "input[name='username']";
const instagramPasswordSelector = "input[name='password']";
const searchInputSelector = "input[placeholder='Search']";
const likeButtonSelector = 'svg[aria-label="Like"]';

const USERNAME = process.env.USERNAMEIG;
const PASSWORD = process.env.PASSWORD;
const SEARCH_QUERY = "john cena";
const MAX_POSTS_TO_LIKE = 10;

async function login(page) {
    await page.goto('https://www.instagram.com');
    await page.waitForSelector(instagramUsernameSelector);
    await page.type(instagramUsernameSelector, USERNAME, { delay: 100 });
    await page.type(instagramPasswordSelector, PASSWORD, { delay: 100 });
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.click("button[type='submit']"),
    ]);
}

async function searchForUser(page, username) {
    await page.waitForSelector("svg[aria-label='Search']");
    await page.click("svg[aria-label='Search']");
    await page.waitForSelector(searchInputSelector);
    await page.type(searchInputSelector, username);
    await page.waitForTimeout(3000); // Wait for search results to load
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4000); // Wait for user page to load
}

async function clickFirstPost(page) {
    await page.waitForSelector("a[href^='/p/']");
    const postLinks = await page.$$("a[href^='/p/']");
    if (postLinks.length > 0) {
        await postLinks[0].click();
    } else {
        throw new Error("No posts found on the page.");
    }
}

async function likePosts(page) {
    await page.waitForSelector(likeButtonSelector);
    for (let i = 0; i < MAX_POSTS_TO_LIKE; i++) {
        await page.click(likeButtonSelector);
        await page.waitForTimeout(3000); // Wait before liking the next post
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(3000);
        // await page.waitForNavigation({ waitUntil: "networkidle2" }); // Wait for the next post to load
    }
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 639,
        deviceScaleFactor: 1,
        mobile: false,
        hasTouch: false,
        isLandscape: true,
    });

    try {
        await login(page);
        await searchForUser(page, SEARCH_QUERY);
        await clickFirstPost(page); // Click on the first post
        await likePosts(page);
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        await browser.close();
    }
})();
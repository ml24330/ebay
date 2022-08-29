const puppeteer = require('puppeteer');
require('dotenv').config();

USERNAME = process.env.EBAY_USERNAME;
PASSWORD = process.env.EBAY_PASSWORD;


(async () => {

    const auction = {
        // Structure of an auction object
        // condition: "",
        // description: "",
        // end_date: "",
        // bids: [],
        // postage: "",
        // seller_ratings: [],
        // seller_stars: [],
        // seller_volume: ""
    }

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.ebay.co.uk/itm/234667695790?hash=item36a348deae:g:InQAAOSwB3RjAiAI');
    await page.waitForSelector('.condText');

    auction.condition = await page.evaluate(el => el.textContent, await page.$('.condText'));

    try {
        auction.description = await page.evaluate(el => el.textContent, await page.$('.topItmCndDscMsg'));
    } catch {
        auction.description = '';
    }

    auction.end_date = await page.evaluate(el => el.textContent, await page.$('#bb_tlft'));
    auction.end_date = auction.end_date.replace(/[\n\t\r]/g,"").slice(0,-12);

    const postage_el = await page.$('#fshippingCost');
    auction.postage = await postage_el.evaluate(el => el.textContent);
    auction.postage = auction.postage.replace(/[\n\t\r]/g,"");


    // Gather information of the seller

    const seller_href = await page.evaluate(el => el.getAttribute('href'), await page.$('.vi-VR-margBtm3 > a'));

    const seller_page = await browser.newPage();
    await seller_page.goto(seller_href);
    await seller_page.waitForSelector('#str-tab-tab2');
    
    const feedback_el = await seller_page.$('#str-tab-tab2 > span');
    await feedback_el.click();

    const ratings_els = await seller_page.$$('.feedback-overall-rating__details > div > a > .INLINE_LINK')
    ratings = [];
    for (const [idx, ratings_el] of ratings_els.entries()) {
        ratings[idx] = await ratings_el.evaluate(el => el.textContent);
    }
    auction.seller_ratings = ratings;

    const stars_els = await seller_page.$$('.detail-seller-rating > span');
    stars = [];
    for (let [idx, stars_el] of stars_els.entries()) {
        stars[idx] = await stars_el.evaluate(el => el.textContent);
    }
    auction.seller_stars = stars;

    let volume = await seller_page.evaluate(el => el.textContent, await seller_page.$('.str-seller-card__stats-content > div:nth-child(2)'));
    volume = volume.slice(0,-11)
    auction.seller_volume = volume.charAt(volume.length-1) == 'K' ? parseFloat(volume)*1000 : volume


    // Collect information about bids

    const bids_href = await page.evaluate(el => el.getAttribute('href'), await page.$('#vi-VR-bid-lnk-'));

    const bids_page = await browser.newPage();
    await bids_page.goto(bids_href);

    await bids_page.waitForSelector('input[name="userid"]');
    await bids_page.type('input[name="userid"]', USERNAME);

    const continue_btn = await bids_page.$('#signin-continue-btn');
    await continue_btn.click();

    await bids_page.waitForSelector('input[name="pass"]');
    await bids_page.type('input[name="pass"]', PASSWORD);

    const signin_btn = await bids_page.$('#sgnBt');
    await signin_btn.click();

    await bids_page.waitForSelector('#showAutoInput');

    const bids_history_el = await bids_page.$('#showAutoInput');
    await bids_history_el.click();

    const table_selector = '.app-bid-history__table > tbody';
    const bid_count = await bids_page.$$eval(`${table_selector} > tr`, el => el.length)    
    const bids = {};
    
    for (let i = 1; i < parseInt(bid_count) + 1 ; i++) {
        let bidder = await bids_page.evaluate(el => el.textContent, await bids_page.$(`${table_selector} > tr:nth-child(${i}) > td:nth-child(1) > div > span:nth-child(1) > span`));
        bidder = bidder.slice(-5);
        const amount = await bids_page.evaluate(el => el.textContent, await bids_page.$(`${table_selector} > tr:nth-child(${i}) > td:nth-child(2) > div > span > span`));

        if (!(bidder in bids)) {
            bids[bidder] = amount
        }
    }

    auction.bids = Object.values(bids);

    console.log(auction);
})()
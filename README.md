## ebay auction data scraper

This is a WIP web scraper built using Puppeteer. Variables collected per completed auction are
- item condition (```condition```)
- item description (```description```)
- end date (```end_date```)
- postage cost (```postage```)
- seller feedback ratings (positive, neutral, negative) (```seller_ratings```)
- detailed seller ratings (accurate description, reasonable postage cost, delivery time, communication) (```seller_stars```)
- sales volume of seller (```seller_volume```)
- final bid of all bidders and starting bid (```bids```)

The demo script (```index.js```) only scrapes one link at a time. Scraping with scale is to be implemented together with fallback methods when ebay triggers a CAPTCHA.

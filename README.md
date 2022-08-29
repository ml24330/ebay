## ebay auction data scraper

This is a WIP web scraper built using Puppeteer. Variables collected per completed auction are
- item condition (```condition```): _Enum_
- item description (```description```): _String_
- end date (```end_date```): _Date_
- postage cost (```postage```): _Float_
- seller feedback ratings (positive, neutral, negative) (```seller_ratings```): _[Integer]_
- detailed seller ratings (accurate description, reasonable postage cost, delivery time, communication) (```seller_stars```): _[Float]_
- sales volume of seller (```seller_volume```): _Integer_
- final bid of all bidders and starting bid (```bids```): _[Float]_

The demo script (```index.js```) only scrapes one link at a time. Scraping with scale is to be implemented together with fallback methods when ebay triggers a CAPTCHA.

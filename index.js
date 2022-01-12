const Page = require("./Page");

const pesapalCareers = new Page(
  "pesapal careers",
  "https://pesapal.freshteam.com/jobs/-z8xM8RCgTx7/junior-developer?ft_source=LinkedIn_1000080706&ft_medium=Job%20Boards_1000074720"
);
const ecommerceScrapingSite = new Page(
  "ecommerce scraping site",
  "https://webscraper.io/test-sites/e-commerce/allinone"
);

pesapalCareers.scrape();
ecommerceScrapingSite.scrape();
// pesapalCareers.findNonEnglishWords();
// ecommerceScrapingSite.findNonEnglishWords();
// console.log(ecommerceScrapingSite.compare(pesapalCareers));

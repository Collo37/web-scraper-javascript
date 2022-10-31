const Page = require("./Page");

const myGithub = new Page("My Github", "https://github.com/Collo37");
const ecommerceScrapingSite = new Page(
  "ecommerce scraping site",
  "https://webscraper.io/test-sites/e-commerce/allinone"
);

myGithub.scrape();
ecommerceScrapingSite.scrape();
// myGithub.findNonEnglishWords();
// ecommerceScrapingSite.findNonEnglishWords();
// console.log(ecommerceScrapingSite.compare(myGithub));

const puppeteer = require("puppeteer");
const fs = require("fs");

const dictionary = require("./wordlists/words_dictionary.json");

const alphabet = JSON.parse(
  fs.readFileSync(`${__dirname}/wordlists/alphabet.txt`, "utf-8")
);

module.exports = class Page {
  constructor(pageName, address) {
    this.pageName = pageName;
    this.target = address;

    // scrape the page
    this.scrape = async () => {
      //launch the scrapper
      console.log("Scraping. Please wait...");

      (async () => {
        const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();

        await page.goto(this.target);

        // get all the texts on the page
        const getPageText = await page.evaluate(() => {
          const textElements = [
            "p",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "strong",
            "span",
            "a",
            "article",
            "li",
          ];
          let texts = [];

          for (let index = 0; index < textElements.length; index++) {
            let paragraph = document.querySelectorAll(textElements[index]);
            paragraph &&
              paragraph.forEach((item) => {
                texts.push(item?.innerText.toLowerCase());
              });
          }
          return texts;
        });

        // filter the texts into single words
        let allPageTexts = [...getPageText];
        let splitTexts = [];
        allPageTexts.forEach((sentence) => {
          let spacesRemoved = sentence.split(" ");
          splitTexts.push(...spacesRemoved);
        });

        // remove non-alphabet characters from the words
        let cleanedTexts = [];

        splitTexts.forEach((text) => {
          let brokenWord = text.split("");
          let verifiedWord = [];

          brokenWord.forEach((letter) => {
            if (alphabet.includes(letter) && letter !== "") {
              verifiedWord.push(letter);
            }
          });

          let joinedWord = verifiedWord.join("");
          cleanedTexts.push(joinedWord);
          cleanedTexts.sort();
        });

        // Define number of occurrences of each word
        let wordList = {};

        cleanedTexts.forEach((text) => {
          if (wordList[text]) {
            wordList[text] = wordList[text] + 1;
          } else {
            wordList[text] = 1;
          }
        }); // wordList object with syntax -> {word: count}

        // save the data to text file
        fs.writeFile(
          `${__dirname}/output/${this.pageName}.json`,
          JSON.stringify(wordList),
          (err) => {
            if (err) throw err;
            console.log("File saved successfully. Check output folder");
          }
        );
        await browser.close();
      })();
    };
  }

  // find non-english words on page
  findNonEnglishWords = async () => {
    let nonEnglishWords = [];

    // reading the contents of the saved words file
    try {
      let words = await JSON.parse(
        fs.readFileSync(
          `${__dirname}/output/${this.pageName}.json`,
          (err, data) => {
            if (err) return "Scrape the page first then try again";
            return data;
          }
        )
      );

      // pushing non-english words to array
      Object.keys(words).forEach((word) => {
        if (!dictionary[word]) {
          nonEnglishWords.push(word);
        }
      });

      //save the non-english words
      fs.writeFile(
        `${__dirname}/output/non-english-${this.pageName}.txt`,
        JSON.stringify(nonEnglishWords),
        (err) => {
          if (err) throw err;
          console.log(
            "Non-english words successfully saved to the output folder"
          );
        }
      );
    } catch (error) {
      console.log("Sorry. Scrape the page first then try again");
    }
  };

  // compare with another website
  compare = (siteName) => {
    try {
      let site = this.pageName;
      let otherSite = siteName.pageName;

      // read the output of both pages
      let siteWords = JSON.parse(
        fs.readFileSync(`${__dirname}/output/${site}.json`)
      );
      let otherSiteWords = JSON.parse(
        fs.readFileSync(`${__dirname}/output/${otherSite}.json`)
      );

      let siteAnalytics = {
        commonWords: [],
        uniqueToFirstSite: [],
        uniqueToOtherSite: [],
      };

      //extract the words from the words object keys
      let siteWordsArr = Object.keys(siteWords);
      let otherSiteWordsArr = Object.keys(otherSiteWords);

      // iterate through both arrays and compare
      siteWordsArr.forEach((siteWord) => {
        if (otherSiteWordsArr.includes(siteWord)) {
          siteAnalytics.commonWords.push(siteWord);
        } else {
          siteAnalytics.uniqueToFirstSite.push(siteWord);
        }
      });

      otherSiteWordsArr.forEach((otherSiteWord) => {
        if (!siteWordsArr.includes(otherSiteWord)) {
          siteAnalytics.uniqueToOtherSite.push(otherSiteWord);
        }
      });

      return siteAnalytics;
    } catch (error) {
      console.log("Both websites must first be scraped to compare them");
      console.error(error);
    }
  };
};

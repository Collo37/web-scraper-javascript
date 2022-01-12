const puppeteer = require("puppeteer");
const fs = require("fs");

const dictionary = require("./wordlists/words_dictionary.json");

const alphabet = JSON.parse(
  fs.readFileSync(`${__dirname}/wordlists/alphabet.txt`, "utf-8")
);

class Page {
  constructor(target) {
    this.target = target;
  }
  // scrape the page
  scrape = async () => {
    //launch the scrapper
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
        `${__dirname}/output/${(await page.title()) || ""}_wordlist.json`,
        JSON.stringify(wordList),
        (err) => {
          if (err) throw err;
          console.log("File saved successfully");
        }
      );

      await browser.close();
      return wordList;
    })();
  };
}

const pesapalCareers = new Page(
  "https://pesapal.freshteam.com/jobs/-z8xM8RCgTx7/junior-developer?ft_source=LinkedIn_1000080706&ft_medium=Job%20Boards_1000074720"
);

pesapalCareers.scrape();

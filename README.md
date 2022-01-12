# Javascript Web scraper

## Description
This is the complete implementation of pesapal careers problem 3: Diction & dictionary scrapping.
It is a simple web scraping program that scrapes the content of a page and outputs its consistuent words.

The program can also check for non-english words used in the website and also compare words between different pages.

## Technologies:
1. Node js
2. puppeteer npm package


## Installation
Download or clone the repository and run ```npm install``` inside the project directory.

## Usage
The entire project runs in index.js.

1. Import the Page class from Page.js.

 ```const Page = require("./Page")```

2. Create a new instance of the class.
This takes 2 arguments, pageName and url.

 ```const testPage = new Page("test page", "http://localhost:3000")```

3. Use the ```scrape``` method to scrape the contents of the page.

 ```testPage.scrape()```.
 
 This will create a JSON file of the words on the page and the number of occurrences of each word inside the output folder.
 

4. To find the non-english words used on the page use the ```findNonEnglishWords``` method.

```testPage.findNonEnglishWords()```

5. To compare words used in two different pages use the ```compare``` method.

This method takes the second page name as an input.

```testPage.compare(otherPage)``` where otherPage is also an instance of the Page class.

### NOTE:
The ```findNonEnglishWords``` and ```compare``` methods will only work after running the ```scrape``` method.

## Credits
[English Dictionary from dwyl on Github](https://github.com/dwyl/english-words)
[Web scraping with puppeteer](https://www.youtube.com/watch?v=Sag-Hz9jJNg&t=223s)

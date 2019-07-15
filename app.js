var Promise = require("bluebird");
var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs').promises;

var url = "https://medium.com/";

let allPages = [];
let uniqueValues;
let uniqueArray = [];

scanPage = async (url) => {
    let listofPageURL = [];
    var options = {
        uri: url,
        resolveWithFullResponse: true,
        timeout: 60000
    }
    try {
        debugger;
        const response = await rp(options);
        const $ = cheerio.load(response.body);
        $('a.ds-link').each(function (i, elem) {
            if (elem.attribs.href != url) {
                listofPageURL.push(elem.attribs.href);
                allPages.push(elem.attribs.href);
                console.log(elem.attribs.href);
            }
        });
        debugger;
        //allPages.push(listofPageURL);
        Promise.map(listofPageURL, scanPage, { concurrency: 5 }).then((result) => {
            debugger;
            uniqueValues = new Set(allPages);
            uniqueArray = [...uniqueValues]
            const file = fs.readFile('urls.txt', 'utf8').then(() => {
                fs.appendFile('urls.txt', uniqueArray.toString() + "\n");
            });
            
        });
    } catch (error) {}
}

scanPage(url);
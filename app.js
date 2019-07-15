var Promise = require("bluebird"),
    rp = require('request-promise'),
    cheerio = require('cheerio'),
    fsys = require('fs'),
    fs = require('fs').promises;

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
        const response = await rp(options);
        const $ = cheerio.load(response.body);
        $('a.ds-link').each(function (i, elem) {
            if (elem.attribs.href != url) {
                listofPageURL.push(elem.attribs.href);
                allPages.push(elem.attribs.href);
                console.log(elem.attribs.href);
            }
        });
        Promise.map(listofPageURL, scanPage, { concurrency: 5 }).then((result) => {
            uniqueValues = new Set(allPages);
            uniqueArray = [...uniqueValues]
            const file = fs.readFile('urls.txt', 'utf8').then(() => {
                fs.appendFile('urls.txt', uniqueArray.toString() + "\n");
            });

        });
    } catch (error) { }
}

createFile = (fileName) => {
    return new Promise((success, reject) => {
        fsys.access(fileName, fsys.constants.F_OK, function (err) {
            if (err) {
                fs.writeFile(fileName, '').then(() => {
                    success();
                }).catch(() => { reject(); });
            } else {
                success();
            }
        });
    });
}

createFile('urls.txt').then(() => {
    scanPage(url);
}).catch(() => console.log('Failed to create file'));


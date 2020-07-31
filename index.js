const fetch = require('node-fetch');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');

const MONTHS = new Set (['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']);
const YEARS =   new Set(["2020", "2021", "2019", "2018"]);
/*
1. Get all table ids
2. Parse tables
*/

( async () => {
    const res = await fetch("https://www.playnj.com/sports-betting/revenue/");
    const html = await res.text();
    const $ = cheerio.load(html);
    cheerioTableparser($);

    const tableIds = []
    let prevElement;

    const findMonth = (element, prev) => {
        const previousElements = $($(element).prevUntil(prev).get().reverse());
        let returnVal;
        previousElements.each((idx, ele) => {
            for (const month of MONTHS) {
                const eleString = $(ele).text().toLowerCase();
                if (eleString.includes(month)) {
                    returnVal = ele;
                }
            }

        });
        return returnVal;
    }

    const getMonthText = (string) => {
        for (const month of MONTHS) {
            if (string.toLowerCase().includes(month)) {
                return month
            }
        }
    }

    const getYearText = (string) => {
        for (const year of YEARS) {
            if (string.toLowerCase().includes(year)) {
                return year
            }
        }
        return new Date ().getFullYear().toString()
    }

    let info = {}
    $("table").each((idx, ele) => {
        if (idx % 2 === 0) {
            idx > 0 && tableIds.push(info)
            const month = findMonth(ele, prevElement);
            prevElement = month;
            const elementText = $(month).text();
            info = {
                ...info,
                month: getMonthText(elementText),
                year: getYearText(elementText),
                onlineRevTableId: ele.attribs.id,
            };
            // tableIds.push(info);  
        } else {  
            info = {
                ...info,
                retailRevTableId: ele.attribs.id
            };
        }
    });

    console.log(tableIds)

})()
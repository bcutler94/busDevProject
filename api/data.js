const fetch = require('node-fetch');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const { URLS, MONTHS, YEARS } = require('./consts');


const getData = async (state) => {

    
    const res = await fetch(URLS[state]);
    const html = await res.text();
    const $ = cheerio.load(html);

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

    cheerioTableparser($);
    const tableInfo = []
    let prevElement;
    let info = {}
    $("table").each((idx, ele) => {
        switch (state) {
            case 'nj':
                if (idx % 2 === 0) {
                    idx > 0 && tableInfo.push(info)
                    info = {}
                    const month = findMonth(ele, prevElement);
                    prevElement = month;
                    const elementText = $(month).text();
                    info = {
                        ...info,
                        month: getMonthText(elementText),
                        year: getYearText(elementText),
                        onlineRevTableId: ele.attribs.id,
                    };
                } else {  
                    info = {
                        ...info,
                        retailRevTableId: ele.attribs.id
                    };
                }
                break;
            case 'pa':
                const month = findMonth(ele, prevElement);
                prevElement = month;
                const elementText = $(month).text();
                info = {
                    month: getMonthText(elementText),
                    year: getYearText(elementText),
                    sportsRevId: ele.attribs.id
                }
                tableInfo.push(info)
                info = {}
                break;
            case 'in':
                break;
            case 'wv':
                break;
        }

    });

    const formatTable = (table) => {
        if (!table || !table[0]) return;
        const operators = table[0].slice(1);
        console.log(operators)
        return table.slice(1).map((row) => {
            return {
                title: row[0],
                data: row.slice(1).map((ele, idx) => ({ 
                    x: operators[idx],
                    y: ele 
                }))
            }
        })
    }

    return tableInfo.map((ele) => {
        return {
            month: ele.month,
            year: ele.year,
            onlineRevTable: formatTable($("#" + ele.onlineRevTableId).parsetable(false, false, true)),
            retailRevTable: formatTable($("#" + ele.retailRevTableId).parsetable(false, false, true)),
            sportsTableTable: formatTable($("#" + ele.sportsRevId).parsetable(false, false, true))
        }
    })
}

module.exports = {
    getData
}
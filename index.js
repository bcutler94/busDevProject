const express = require('express');
const app = express();
const PORT = 3001;

const { getData } = require('./api/data');

app.get('/data', async (req, res) => {
    const { states = '' } = req.query;
    const statesArray = states.split(',')
    // console.log('state', states)
    const statePromises = statesArray.map((ele) => getData(ele));
    const stateData = (await Promise.all(statePromises)).reduce((obj, ele, idx) => {
        obj[statesArray[idx]] = ele;
        return obj
    }, {});
    return res.json(stateData);
});

app.listen(PORT, () => console.log("started server"))
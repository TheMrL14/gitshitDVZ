const express = require('express')
const app = express()
const port = 3000
const path = require("path");
const csv = require("csvtojson");
const imdb = require('imdb-api');
var fs = require('fs');
var parsedJsondata = {};
var jsonData = [];



let init = () => {
  csv()
    .fromFile("./data/NicCage.csv")
    .then((parsed) => {

      parsedJsondata = parsed;
      dataCrunch();

      //app.listen(port, () => console.log(`Meteorite app listening on port ${port}!`));
    })
  //  console.log(jsondata.length);
  //
};

let dataCrunch = () => {
  for (let i = 0; i < parsedJsondata.length; i++) {
    imdb.get({
      name: String(parsedJsondata[i].title)
    }, {
      apiKey: '2a38c7fe',
      timeout: 10000
    }).then((data) => {
      jsonData.push(data);

    }).catch(console.log);
  }
  setTimeout(
    function() {
      var myJsonString = JSON.stringify(jsonData);
      fs.writeFileSync('data/nicCageMovies.json', myJsonString);
    }, 10000);

};

init();
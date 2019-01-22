//hier gebeurt de server shit
const express = require('express');
const app = express()
const port = process.env.PORT || 3000;
const path = require("path");
const csv = require("csvtojson");
let jsondata;



app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/app', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app.js'));
});

app.get('/dataCSV', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/data.csv'));
});

app.get('/style', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/style.css'));
});


let init = () => {
  app.listen(port, () => console.log(`app listening on port ${port}!`));
};

init();
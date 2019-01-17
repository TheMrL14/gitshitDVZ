var app = require('express')();
var server = require('http').Server(app);
var NewsAPI = require('newsapi');
const port = 3000
const path = require("path");
const Twit = require('twit');

var tweetData = { // Live tweets data
  tweets: [],
  news: [],
  trending: []
};

var T = new Twit({
  consumer_key: 'uRibpQoyXpm2gjxKtw3nXh04s',
  consumer_secret: 'P5RhokuaoHVpAqmyKdDUD0InKSNyduak2wKkB0NruSZJO3CWnY',
  access_token: '549486158-H7CKP2f5jTbmTErbxT6g7ncdNiZQ70haS4iKB5ip',
  access_token_secret: 'h0EXdwnKxPksJ647QBG4lQ4DcHnpGQLVPzgAZ6RpAqRzd'
})


var newsapi = new NewsAPI('266cbcc112af47e98c012021263ab0de');

verifyCredentials();


function verifyCredentials() { //verify Credentials for using the twitter API
  T.get('account/verify_credentials', {
    include_entities: false,
    skip_status: true,
    include_email: false
  }, onAuthenticated)

  function onAuthenticated(err, res) {
    if (err) {
      throw err
    }
    htmlPage();
    //GetTrends(23424757); //Belgium
    GetTrends(1);
    //sockets();

  }
}


function GetTrends(Searchid) { //Get Global trends from the twitter API
  T.get('trends/place', {
    id: Searchid,
    count: 10
  }, function(err, data, response) {
    var response = data[0].trends;

    for (var i = 0; i <= 5; i++) {
      tweetData.trending.push(response[i]);
      console.log(response[i].name);
    }
    streamTweets();
    getNews();
  })
}

function streamTweets() { //stream tweets from twitter with trending topic

  var stream = T.stream('statuses/filter', {
    track: tweetData.trending[0].name
  })

  stream.on('tweet', function(tweet) {
    tweetData.tweets.push(tweet);
    if (tweetData.tweets.length > 300) {
      for (var i = 0; i <= 100; i++) {
        tweetData.tweets.splice(0, 100);

      }
    }
  })
}


function htmlPage() {




  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  });

  app.get('/app', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/draw.js'));
  });


  app.get('/style', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.css'));
  });

  app.get('/settings', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/settings.json'));
  });
  app.get('/data', function(req, res) {

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(tweetData));
    //tweetData.tweets.splice(0, 300);;
  });


  let init = () => {
    app.listen(port, () => console.log(`App listening on port ${port}!`));

  };

  init();

}


function getNews() {
  newsapi.v2.everything({
    q: tweetData.trending[0].name,

  }).then(response => {
    tweetData.news.push(response.articles);
    /*
      {
        status: "ok",
        articles: [...]
      }
    */
  });
}
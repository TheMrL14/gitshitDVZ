var responseData, oldCount, newCount;
oldCount = newCount = 0;
var sets = {};

//----------------------------------------------------------------GET settings

var datarequest = new XMLHttpRequest();
datarequest.open('GET', '/data', true);
datarequest.onload = function() {
  var settingrequest = new XMLHttpRequest();
  settingrequest.open('GET', '/settings', true);
  var that = this;
  settingrequest.onload = function() {
    //load settings
    var settings = JSON.parse(this.response);
    //load data
    var data = JSON.parse(that.response);
    //assign globals
    responseData = data;
    oldCount = responseData.tweets.length;
    sets = settings;
    //start viz
    init();
  }
  settingrequest.send();
}
datarequest.send();




function init() {
  setupVisuals();
  var myp5 = new p5(s, sets.vizID);
  console.log("done");

}
//---------------------------------------------------------------- SKETCH
var s = function(sketch) {
  const settings = sets.sketch;
  const w = window.innerWidth;
  const h = window.innerHeight;

  var tweetBubbles = [];

  sketch.setup = function() {
    var canv = sketch.createCanvas(w, h);
    var bubble;
    bubble = new TweetBubble();
    tweetBubbles.push(bubble);
  }

  sketch.draw = function() {
    update();
    sketch.background(settings.backgroundColor);
    for (var i = 0; i < tweetBubbles.length; i++) {
      tweetBubbles[i].move();
      tweetBubbles[i].show();
    }
  }

  sketch.mousePressed = function() {
    // var div = $("#tweetContent")
    //   .css({
    //     "display": 'none'
    //   })
    for (var i = 0; i < tweetBubbles.length; i++) {
      tweetBubbles[i].clicked(sketch.mouseX, sketch.mouseY);
    }
  }

  function update() {
    var datarequest = new XMLHttpRequest(); //Get request for new tweets
    datarequest.open('GET', '/data', true);
    datarequest.onload = function() {
      var data = JSON.parse(this.response);
      responseData = data
      newCount = responseData.tweets.length;
      //---------------------------------------------------------------------------------------------------Add new Tweets
      var newTweets = newCount - oldCount;
      for (var i = 1; i <= newTweets; i++) {
        var tempText = responseData.tweets[responseData.tweets.length - i].text;
        var tempFavouriteCount = responseData.tweets[i];
        var newOfSplits = sketch.random();
        if (newOfSplits > settings.kansOpSplitsen) {

          var index = sketch.round(sketch.random(tweetBubbles.length - 1));
          var bubble1 = tweetBubbles[index].newTweet();
          var bubble2 = tweetBubbles[index].newTweet();

          bubble2.setText(tempText);
          tweetBubbles.push(bubble1);
          tweetBubbles.push(bubble2);
          tweetBubbles.splice(i, 1);
        } else {
          var bubble;
          bubble = new TweetBubble();
          bubble.pos = sketch.createVector(sketch.random(w), sketch.random(h));
          console.log(tempText);
          bubble.setText(tempText);
          tweetBubbles.push(bubble);
        }
      }
      oldCount = newCount;
      newTweets = 0;

    }
    datarequest.send();
    //---------------------------------------------------------------------------------------------------
  }

  function TweetBubble(pos, r, text) { //https://www.youtube.com/watch?v=jxGS3fKPKJA&index=6&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH

    if (pos) {
      this.pos = pos.copy();
    } else {
      this.pos = sketch.createVector(sketch.random(w), sketch.random(h));
    }

    if (this.radius < settings.minRadius) {
      this.radius = settings.minRadius;
    }

    this.radius = r || settings.standardRadius;
    this.text = text;
    this.color = sketch.color(29, 161, 242, 80); // Twitter Blue
    this.move = function() {
      var vel = p5.Vector.random2D();
      this.pos.add(vel);
    }

    this.show = function() {
      sketch.noStroke();
      sketch.fill(this.color);


      sketch.ellipse(this.pos.x, this.pos.y, this.radius, this.radius)
    }
    this.setText = function(text) {
      this.text = text;
    }


    this.clicked = function(px, py) { // If TweetBubbles are clicked => display content

      var distance = sketch.dist(px, py, this.pos.x, this.pos.y);
      if (distance < this.radius) {
        console.log(this.text);

        var div = $("#tweetContent") //https://stackoverflow.com/questions/14032568/create-a-div-next-to-the-cursor-position-on-click
          .css({
            "left": this.pos.x + 'px',
            "top": this.pos.y + 'px'
          })
          .html('<p>' +
            this.text + '</p>')

      } else {

      }

    }
    this.newTweet = function() {
      var newPos = sketch.createVector(this.pos.x + sketch.random(settings.maxRandomSpawnPoint), this.pos.y + sketch.random(settings.maxRandomSpawnPoint));
      var newBubble = new TweetBubble(newPos, this.radius - settings.sizeDifNewTweet, this.text);
      return newBubble;
    }
  }




}

function setupVisuals() {
  $('#topic').html(responseData.trending[0].name);
}

//localhost:3000/socket.io/?EIO=3&transport=websocket&sid=gKe19riGNLiNHmzKAAAT
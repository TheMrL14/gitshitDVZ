var sets = {};

var settingrequest = new XMLHttpRequest();
settingrequest.open('GET', '/settings', true);
var that = this;
settingrequest.onload = function() {
  //load settings
  var settings = JSON.parse(this.response);
  //load data
  sets = settings
  //start viz
  var myp5 = new p5(s, sets.vizID);
  console.log("done");
}
settingrequest.send();

var s = function(sketch) {
  var currentTime = 0;
  var avgRadius = 0;
  var grow = true;
  var hour = 10;
  var song, fft, timeFrame;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const settings = sets.sketch;
  let height = sketch.height;
  let centerPos = sketch.createVector(w / 2, h);
  let pos = [];

  sketch.preload = function() { //load sound from file
    song = sketch.loadSound(sets.soundSrc);
  }


  sketch.setup = function() {
    fft = new p5.FFT();
    song.amp(settings.songAmp);
    sketch.noStroke();
    var canv = sketch.createCanvas(w, h);
    canv.mouseClicked(togglePlay);
    sketch.textFont(settings.textFont);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    pos.push(centerPos);
    song.play();
  };

  sketch.draw = function() {
    var spectrum = fft.analyze();
    sketch.background(settings.secondarycol);
    if (song.isPlaying() && grow) {
      changePos();
    }
    timeThing(); //hour
    drawStem();
    drawPoppy();
    drawCenter();

    function timeThing() {
      var timeX = w / 2;
      var timeY = settings.textSize * 2; // put Y text on top of page
      var timeText;
      timeFrame = song.currentTime()
      timeFrame = Math.round(timeFrame);
      timeText = timeFrame - settings.secTo11H; // Let clock start at 10:40

      sketch.fill(settings.centerColor);
      sketch.textSize(settings.textSize + "%");
      sketch.text("WO I: The last seconds", timeX, settings.textSize / 2); //Top text

      var seconds = (timeText % settings.secondsInAMinute + settings.secondsInAMinute) % settings.secondsInAMinute; //seconds of video between 0 and 60
      if (seconds == 0) { //change h to 11
        hour = 11;
      }
      sketch.textSize(settings.textSize);
      if (seconds < 10) { //
        sketch.text(hour + ":0" +
          seconds, timeX, timeY);
      } else {
        sketch.text(hour + ":" +
          seconds, timeX, timeY);
      }
      if (seconds == 11) {
        grow = false;
      }
      if (seconds == settings.endSec) {
        location.reload();
      }
    }

    function changePos() {
      centerPos.y -= settings.stemGrow;
      centerPos.x += sketch.map(sketch.noise(song.currentTime()), 0, 1, -0.4, 0.4);
      var tempPos = sketch.createVector(centerPos.x, centerPos.y);
      currentTime = timeFrame;
      pos.push(tempPos);
    }

    function drawStem() {
      sketch.noFill();
      sketch.stroke(settings.plantColor);
      sketch.strokeWeight(settings.stemWidth);
      sketch.beginShape();

      for (let index = 0; index < pos.length; index++) {
        sketch.curveVertex(pos[index].x, pos[index].y);
      }
      sketch.endShape();
    }

    function drawPoppy() {
      sketch.fill(settings.primarycol);
      sketch.stroke(settings.primarycol);
      sketch.beginShape();
      var coord = sketch.createVector();

      for (let index = settings.tresholdMin; index < spectrum.length - settings.tresholdMax; index++) {

        let element = spectrum[index];
        const angle = index / settings.secondsInAMinute * 2 * sketch.PI;
        var dir;

        coord = sketch.createVector();
        coord.x = sketch.cos(angle);
        coord.y = sketch.sin(angle);


        let radius = sketch.map(spectrum[index], 0, 255, 100, 200 + (song.currentTime() * 2));

        if (spectrum[index] < 5) {
          radius = sketch.map(sketch.noise(index + song.currentTime() / 2), 0, 1, 20 + (song.currentTime() * 2), 100 + (song.currentTime()));
        }

        avgRadius += radius;

        coord.mult(radius);
        coord.add(centerPos);

        sketch.curveVertex(coord.x, coord.y);

      }
      avgRadius /= spectrum.length;
      sketch.endShape();
    }

    function drawCenter() {
      sketch.fill(settings.centerColor);
      sketch.stroke(settings.centerColor);
      sketch.ellipse(centerPos.x, centerPos.y, settings.center + avgRadius * 2, settings.center + avgRadius * 2);
      sketch.fill(settings.secondarycol);
      sketch.stroke(settings.secondarycol);
    }
  };

  function togglePlay() {
    if (song.isPlaying()) {
      console.log("pause")
      song.pause();
    } else {
      console.log("play")
      song.play();
    }
  }
}
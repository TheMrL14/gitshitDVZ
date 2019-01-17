let d3Data;
const height = window.innerHeight / 2;
const width = window.innerWidth - 500;
const barWidth = 15;
const barOffset = 10;
const x2Padding = 2;
const yPadding = 0.5;
const textY2Length = 150;

const margin = {
  left: 110,
  right: 50,
  top: 100,
  bottom: 0
};

document.addEventListener('DOMContentLoaded', function() {
  init();
}, false);

//-----------------------------------------------------------------------------------------------------------INIT
let init = () => { // Get data from csv
  d3.csv("/dataCSV")
    .then(function(data) {
      console.log(data);
      d3Data = data.sort(function(x, y) {
        return d3.ascending(x.sunlight, y.sunlight);
      });
      console.log(data);
      setup();
    })
    .catch(function(error) {
      console.log(error);
    })

}
//-----------------------------------------------------------------------------------------------------------SETUP
let setup = () => { //Setup
  //--------------------------------------------------------------------------------------min&max
  let max = d3.max(d3Data, function(d) { //Calc biggest sunlight value
    return parseFloat(d.sunlight);
  });

  let min = d3.min(d3Data, function(d) { //Calc smallest sunlight value
    return parseFloat(d.sunlight);
  });

  let max2 = d3.max(d3Data, function(d) { //Calc biggest litre value
    return parseFloat(d.total_litres_of_pure_alcohol);
  });
  //--------------------------------------------------------------------------------------Scales
  let x = d3.scaleLinear() // scale X  as to max sunlight and half of the width
    .domain([0, max])
    .range([0, width / 2]);

  let x2 = d3.scaleLinear() //scale X  as to max litre and half of the width
    .domain([Math.ceil(max2) + x2Padding, 0])
    .range([0, width / 2]);

  let y = d3.scaleBand() // scale Y to all countries
    .domain(d3Data.map(function(d) {
      return d.country;
    }))
    .range([0, height + ((d3Data.length) * ((barWidth / 2) + barOffset))])
    .padding(yPadding);


  //--------------------------------------------------------------------------------------create axes
  let yAxis = d3.axisLeft(y)
  let xAxis = d3.axisTop(x).scale(x);
  let xAxis2 = d3.axisTop(x2).scale(x2);

  let color = d3.scaleSequential(d3.interpolateMagma)
    .domain([0, max])

  //--------------------------------------------------------------------------------------HTMLSHizzle
  const svg = d3.select("#chart").append("svg") // create svg element
    .attr("width", width * 2)
    .attr("height", height + 200 + ((d3Data.length + 1) * ((barWidth / 2) + barOffset))); //Height of the canvas => height + textHeight + ()(barwidth + barOffset)* dataCount)

  let chartG = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  //------------------------------------------------------------- DRAW Bars

  chartG.selectAll("rect1") // Draw sunlight bars
    .data(d3Data)
    .enter().append("rect")
    .attr("height", barWidth)
    .attr("width", function(d, i) {
      return x(d.sunlight);
    })
    // .attr("fill", function(d, i) {
    //   return color(d.sunlight);
    // })
    .attr("fill", "#f1c40f") //Yellow
    .attr("x", function(d) {
      return width / 2;
    })
    .attr("y", function(d) {
      return y(d.country) + 3;
    });

  chartG.selectAll("rect2") // Draw alcohol bars
    .data(d3Data)
    .enter().append("rect")
    .attr("height", barWidth)
    .attr("width", function(d, i) {
      return (width / 2) - x2(d.total_litres_of_pure_alcohol);
    })
    // .attr("fill", function(d, i) {
    //   return color2(d.total_litres_of_pure_alcohol);
    // })
    .attr("fill", "#3498db") //Blue
    .attr("x", function(d) {
      return x2(d.total_litres_of_pure_alcohol);
    })
    .attr("y", function(d) {
      return y(d.country) + 3;
    });


  //------------------------------------------------------------- DRAW Axes
  chartG.append("g")
    .attr("class", "axis y")
    .call(yAxis);

  chartG.append("g")
    .attr("class", "axis x")
    .attr("transform", "translate(" + width / 2 + ",0)")
    .call(xAxis);

  chartG.append("g")
    .attr("class", "axis x2")
    .call(xAxis2)
  //------------------------------------------------------------- DRAW text
  chartG.append("text")
    .attr("transform",
      "translate(-5 ,-40)")

    .text("Total litres of pure alcohol (l)");

  chartG.append("text")
    .attr("transform",
      "translate(" + ((width) - textY2Length) + " ,-40)")

    .text("Total sunlight in a year (h)");

  chartG.append("text")
    .attr("transform",
      "translate(" + (width / 4) + " ,-60)")
    .attr("class",
      "Title")
    .text("Correlation between alcohol consumption and amount of sunlight");

}
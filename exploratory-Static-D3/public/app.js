let d3Data;
const height = window.innerHeight;
const width = window.innerWidth - 500;
const barWidth = 15;
const barOffset = 20;


document.addEventListener('DOMContentLoaded', function() {
  init();
}, false);


let init = () => {
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

let setup = () => {

  let max = d3.max(d3Data, function(d) {
    return parseFloat(d.sunlight);
  });

  let min = d3.min(d3Data, function(d) {
    return parseFloat(d.sunlight);
  });


  let x = d3.scaleLinear()
    .domain([0, max + 00])
    .range([0, width / 2]);



  let max2 = d3.max(d3Data, function(d) {
    return parseFloat(d.total_litres_of_pure_alcohol);
  });
  console.log(max);

  let x2 = d3.scaleLinear()
    .domain([Math.ceil(max2) + 3, 0])
    .range([0, width / 2]);

  let y = d3.scaleBand()
    .domain(d3Data.map(function(d) {
      return d.country;
    }))
    .range([0, height + ((d3Data.length) * ((barWidth / 2) + barOffset))])
    .padding(0.5);

  let yAxis = d3.axisLeft(y)

  let xAxis = d3.axisTop(x).scale(x);
  let xAxis2 = d3.axisTop(x2).scale(x2);

  let color = d3.scaleSequential(d3.interpolateMagma)
    .domain([0, max])


  const svg = d3.select("#chart").append("svg")
    .attr("width", width * 2 + 400)
    .attr("height", height + 200 + ((d3Data.length + 1) * ((barWidth / 2) + barOffset)));

  let color2 = d3.scaleSequential(d3.interpolateCool)
    .domain([max2, 0])

  const margin = {
    left: 110,
    right: 50,
    top: 100,
    bottom: 0
  };

  let chartG = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")




  chartG.selectAll("rect1")
    .data(d3Data)
    .enter().append("rect")
    .attr("height", barWidth)
    .attr("width", function(d, i) {
      return x(d.sunlight);
    })
    // .attr("fill", function(d, i) {
    //   return color(d.sunlight);
    // })
    .attr("fill", "yellow")
    .attr("x", function(d) {
      return width / 2;
    })
    .attr("y", function(d) {
      return y(d.country) + 3;
    });

  chartG.selectAll("rect2")
    .data(d3Data)
    .enter().append("rect")
    .attr("height", barWidth)
    .attr("width", function(d, i) {
      return (width / 2) - x2(d.total_litres_of_pure_alcohol);
    })
    // .attr("fill", function(d, i) {
    //   return color2(d.total_litres_of_pure_alcohol);
    // })
    .attr("fill", "red")
    .attr("x", function(d) {
      return x2(d.total_litres_of_pure_alcohol);
    })
    .attr("y", function(d) {
      return y(d.country) + 3;
    });

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

  chartG.append("text")
    .attr("transform",
      "translate(-5 ,-40)")

    .text("Total litres of pure alcohol (l)");

  chartG.append("text")
    .attr("transform",
      "translate(" + ((width) - 150) + " ,-40)")

    .text("Total sunlight in a year (h)");

  chartG.append("text")
    .attr("transform",
      "translate(" + (width / 4) + " ,-60)")
    .attr("class",
      "Title")
    .text("Correlation between alcohol consumption and amount of sunlight)");

}
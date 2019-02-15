// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 40,
  right: 40,
  bottom: 40,
  left: 40
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv").then(function(censusData, error) {
  if (error) throw error;

  // Cast the numerical values to a number for each piece of censusData
  censusData.forEach(function(d) {
    d.id = +d.id;
    d.age = +d.age;
    d.ageMoe = +d.ageMoe;
    d.healthcare = +d.healthcare;
    d.healthcareHigh = +d.healthcareHigh;
    d.healthcareLow = +d.healthcareLow;
    d.income = +d.income;
    d.incomeMoe = +d.incomeMoe;
    d.obesity = +d.obesity;
    d.obesityHigh = +d.obesityHigh;
    d.obesityLow = +d.obesityLow;
    d.poverty = +d.poverty;
    d.povertyMoe = +d.povertyMoe;
    d.smokes = +d.smokes;
    d.smokesHigh = +d.smokesHigh;
    d.smokesLow = +d.smokesLow;
  });

  console.log(censusData);

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xLinearScale = d3.scaleLinear()
    .domain([5, d3.max(censusData, d => d.poverty)+5])
    .range([0, chartWidth]);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.obesity)+10])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // // gridlines in x axis function
  // function make_x_gridlines() {		
  //   return d3.axisBottom(xLinearScale)
  //       .ticks(5)
  // }

  // // gridlines in y axis function
  // function make_y_gridlines() {		
  //   return d3.axisLeft(yLinearScale)
  //       .ticks(5)
  // }

  // // add the X gridlines
  // svg.append("g")			
  //   .attr("class", "grid")
  //   .attr("transform", "translate(0," + chartHeight + ")")
  //   .call(make_x_gridlines()
  //       .tickSize(-chartHeight)
  //       .tickFormat("")
  //   )

  // // add the Y gridlines
  // svg.append("g")			
  //   .attr("class", "grid")
  //   .call(make_y_gridlines()
  //       .tickSize(-chartWidth)
  //       .tickFormat("")
  //   )

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG rectangle per piece of censusData
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll("#scatter")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("class", "scatter")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 5)
    .attr("fill", "blue");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity Rate");

  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top-5})`)
    .attr("class", "axisText")
    .text("Poverty Rate");
});

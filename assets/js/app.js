// Define SVG area dimensions
var svgWidth = 820;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 45,
  right: 45,
  bottom: 45,
  left: 45
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
    .domain([d3.min(censusData, d => d.poverty)-1.5, d3.max(censusData, d => d.poverty)+1])
    .range([0, chartWidth]);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.obesity)-1.5, d3.max(censusData, d => d.obesity)+1])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

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
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 15)
    .attr("fill", "blue")
    
  chartGroup.selectAll("#scatter")
    .data(censusData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .attr("dy", 5)
    .text(d => d.abbr)

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity Rate (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top-5})`)
    .attr("class", "axisText")
    .text("Poverty Rate (%)");
});

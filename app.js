
// set the dimensions and margins of the graph
const margin = {top: 80, right: 25, bottom: 30, left: 150},
  width = 1800 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/tayloh/tayloh.github.io/main/formatted.csv").then(function(data) {

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const myGroups = Array.from(new Set(data.map(d => d.group)))
  const myVars = Array.from(new Set(data.map(d => d.variable)))

  // Build X scales and axis:
  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myVars)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  const y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myGroups)
    .padding(0.1);
  svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  const myColor = d3.scaleSequential()
    .interpolator(d3.interpolateOrRd)
    .domain([1,10])

  // create a tooltip
  const tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event,d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "white")
      .style("opacity", 1)
  }
  const mousemove = function(event,d) {
    tooltip
      .html("" + d.group + " - " + d.variable + ": " + d.value)
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2 + "px")
      .style("background-color", "#151515")
      .style("color", "#ddd")
  }
  const mouseleave = function(event,d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  svg.selectAll()
    .data(data, function(d) {return d.variable+':'+d.group;})
    .join("rect")
      .attr("x", function(d) { return x(d.variable) })
      .attr("y", function(d) { return y(d.group) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})



// Total height and width of the SVG element.
const totalWidth = 1800;
const totalHeight = 900;

// Width and height of the visualization.
const margin = {top: 20, right: 25, bottom: 30, left: 150};
const width = totalWidth - margin.left - margin.right;
const height = totalHeight - margin.top - margin.bottom;

// SVG element
const svg = d3.select("#visualization")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read the project data.
d3.csv("https://raw.githubusercontent.com/tayloh/tayloh.github.io/main/formatted_aggregated.csv").then(function(data) {

  // Get the row and column labels from the data.
  const students = Array.from(new Set(data.map(d => d.group)));
  const skills = Array.from(new Set(data.map(d => d.variable)));

  // Use D3 scalebands for X and Y scales.
  const x = d3.scaleBand().range([ 0, width ]).domain(skills).padding(0.05);
  
  svg.append("g").style("font-size", 15).attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).tickSize(0))
  .select(".domain").remove();


  const y = d3.scaleBand().range([ height, 0 ]).domain(students).padding(0.1);
  
  svg.append("g").style("font-size", 15)
  .call(d3.axisLeft(y).tickSize(0))
  .select(".domain").remove();

  // Build color gradient.
  const colorGradient = d3.scaleSequential().interpolator(d3.interpolateOrRd).domain([1,10]);

  // Tooltip element for hovering.
  const tooltip = d3.select("#visualization").append("div").style("opacity", 0)
  .attr("class", "tooltip")
  .style("width", "auto")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px");

  // Event handlers.
  const mouseover = function(event,d) {
    tooltip.style("opacity", 1);
    
    d3.select(this)
    .style("stroke", "white")
    .style("opacity", 1);
  };

  const mousemove = function(event,d) {
    tooltip
    .html("" + d.group + " - " + d.variable + ": " + d.value)
    .style("left", (event.x)/2 + "px")
    .style("top", (event.y)/2 + "px")
    .style("background-color", "#151515")
    .style("color", "#ddd");
  };

  const mouseleave = function(event,d) {
    tooltip.style("opacity", 0);
    
    d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.8);
  };

  // Create the heatmap.
  svg.selectAll()
    .data(data, function(d) {return d.variable+':'+d.group;})
    .join("rect")
      .attr("x", function(d) { return x(d.variable) })
      .attr("y", function(d) { return y(d.group) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return colorGradient(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
});


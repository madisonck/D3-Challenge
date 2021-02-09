// assign SVG dimensions (pixels) to variables
var svgWidth = 960;
var svgHeight = 500;

// assign margin dimensions (pixels) to variables
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// assign shift for top and right margins to variables
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create wrapper, append, and shift
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// append a g element and translate 
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data.csv
d3.csv("assets/data/data.csv").then(function(alpha) {

    // console log data
    console.log(alpha);
   
    // convert to numeric
    alpha.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;   
    });
  
    // create scale functions for x and y axises
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(alpha, d => d.age))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([8, d3.max(alpha, d => d.smokes)])
        .range([height, 0]);

    // axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axises    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // layout circle
    chartGroup.selectAll("circle")
        .data(alpha)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "green")
        .attr("stroke", "pink")
        .attr("stroke-width", "3")
        .attr("opacity", ".5");

    // state abbrev for circles
    chartGroup.append("g").selectAll("text")
        .data(alpha)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.age))
        .attr("y", d => yLinearScale(d.smokes))
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font_family", "sans-serif")
        .attr("fill", "white")
        .style("font-weight", "bold");

    // labels for axises    
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text("Age (Median)");
    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .text("Percentage of Smokers (%)");

    // set up tool tip for initialization
    var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 10])
        .html((d)=> {return (`State: ${d.state}<br>Age (Median): ${d.age}<br>Percentage of Smokers: ${d.smokes}%`)});
    
    // create tooltip
    svg.call(tool_tip);

    // event listener for tool tip show
    circle.on("mouseover", function(data) {
        tool_tip.show(data, this);
    })

    // event listener for tool tip hide
    .on("mouseout", function(data) {
        tool_tip.hide(data);
    });
});
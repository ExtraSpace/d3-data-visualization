async function drawScatter() {
  // 1. Access data
  let dataset = await d3.json("../data/my_weather_data.json");

  const getX = (d) => d.dewPoint;
  const getY = (d) => d.humidity;
  const getColor = (d) => d.cloudCover;

  // 2. Create chart dimension
  const chartSideLength = d3.min([
    window.innerWidth * 0.5,
    window.innerHeight * 0.5,
  ]);
  let dimension = {
    width: chartSideLength,
    height: chartSideLength,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimension.boundWidth =
    dimension.width - dimension.margin.left - dimension.margin.right;
  dimension.boundHeight =
    dimension.height - dimension.margin.top - dimension.margin.bottom;

  // 3. Draw canvas
  const wrapper = d3
    .select("#chart-2")
    .append("svg")
    .attr("viewBox", `0 0 ${dimension.width} ${dimension.height}`);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimension.margin.left}px, ${dimension.margin.top}px)`
    );

  // 4. Create scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, getX))
    .range([0, dimension.boundWidth])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, getY))
    .range([dimension.boundHeight, 0])
    .nice();
  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, getColor))
    .range(["#B7CEF2", "#2979B3"]);

  // 5. Draw Axis and Axis Labels for the plot
  // 5a. X-Axis
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimension.boundHeight}px)`);
  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimension.boundWidth / 2)
    .attr("y", dimension.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-family", "monospace")
    .style("font-size", "1.2em")
    .html("Due Point (&deg;F)");

  // 5b. Y-Axis
  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const yAxis = bounds.append("g").call(yAxisGenerator);
  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimension.boundHeight / 2)
    .attr("y", -dimension.margin.left + 10)
    .attr("fill", "black")
    .style("font-family", "monospace")
    .style("font-size", "1.2em")
    .style("transform", "rotate(-90deg)") // This line rotate everything including x and y
    .style("text-anchor", "middle")
    .html("Relative Humidity");

  // 5c. Legend -
  const colorLegendGenerator = d3.legendColor().scale(colorScale);
  const legend = bounds
    .append("g")
    .call(colorLegendGenerator)
    .style("transform", "translate(10px, 20px)");
  const legendTitle = legend
    .append("text")
    .attr("x", 0)
    .attr("y", "-10px")
    .style("font-size", "0.8em")
    .html("Cloud Cover");

  // 6. Draw data
  const markers = bounds
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("height", 5)
    .attr("width", 5)
    .attr("x", (d) => xScale(getX(d)))
    .attr("y", (d) => yScale(getY(d)))
    .attr("fill", (d) => colorScale(getColor(d)))
    .attr("fill-opacity", 0.4)
    .attr("stroke", (d) => colorScale(getColor(d)));

  // 6. Draw peripherals
}
drawScatter();

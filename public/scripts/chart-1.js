async function drawLineChart() {
  // Import Data using async-await and D3's json method
  const dataset = await d3.json("../data/my_weather_data.json");

  // Function to values from the data
  const getY = (d) => d.temperatureMax;
  const getX = (d) => d3.timeParse("%Y-%m-%d")(d.date);

  // Defining various dimensions
  let dimension = {
    width: window.innerWidth * 0.5,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };

  // Dimension for the actual plot except axis, labels and margins
  dimension.boundWidth =
    dimension.width - dimension.margin.left - dimension.margin.right;
  dimension.boundHeight =
    dimension.height - dimension.margin.top - dimension.margin.bottom;

  // Get the wrapper in html, append svg and give its dimension
  const wrapper = d3
    .select("#chart-1")
    .append("svg")
    .attr("viewBox", `0 0 ${dimension.width} ${dimension.height}`);

  // Group the actual chart components except the axis, title, labels and margins
  // Push the group a little further to adjust for other components
  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimension.margin.left}px, ${dimension.margin.top}px)`
    );

  // Creating Scales for the axes
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, getY))
    .range([dimension.boundHeight, 0]);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, getX))
    .range([0, dimension.boundWidth]);

  // Negative temperature marker
  const below30 = bounds
    .append("line")
    .attr("x1", "0")
    .attr("y1", yScale(30))
    .attr("x2", dimension.width)
    .attr("y2", yScale(30))
    .attr("stroke", "firebrick")
    .attr("stroke-width", 2);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(getX(d)))
    .y((d) => yScale(getY(d)));

  const line = bounds
    .append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "royalblue")
    .attr("stroke-width", 2);

  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const xAxisGenerator = d3
    .axisBottom()
    .scale(xScale)
    .tickFormat(d3.timeFormat("%b"));

  const yAxis = bounds.append("g").call(yAxisGenerator);
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimension.boundHeight}px)`);
}
drawLineChart();

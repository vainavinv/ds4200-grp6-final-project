const stroke = d3.csv("stroke-data.csv");

stroke.then(function (data) {
  data = data.filter(d => +d.age > 16);

  data.forEach(function (d) {
    d.avg_glucose_level = +d.avg_glucose_level;
  });

  let width = 672, height = 672;

  let margin = {
    top: 25.2,
    bottom: 42,
    right: 25.2,
    left: 42
  }

  let svg = d3.select("#boxplot")
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let yscale = d3.scaleLinear()
    .domain([d3.min(data, d => d.avg_glucose_level), d3.max(data, d => d.avg_glucose_level)])
    .range([height - margin.bottom, margin.top])

  let xscale = d3.scaleBand()
    .domain([...new Set(data.map(d => d.stroke))])
    .range([margin.left, width - margin.right])
    .padding(0.5)


  let yaxis = svg.append('g')
    .call(d3.axisLeft().scale(yscale))
    .attr('transform', `translate(${margin.left},0)`)

  let xaxis = svg.append('g')
    .call(d3.axisBottom().scale(xscale))
    .attr('transform', `translate(0, ${height - margin.bottom})`)

  svg.append('text')
    .attr('x', width / 2 - 33.6)
    .attr('y', height - 12.6)
    .text('Stroke Status')
    .attr('font-size', '12.6px')

  svg.append('text')
    .attr('x', -420)
    .attr('y', 8.4)
    .text('Average Glucose Level (mg/dL)')
    .attr('transform', 'rotate(-90)')
    .attr('font-size', '12.6px')

  const rollupFunction = function (groupData) {
    const values = groupData.map(d => d.avg_glucose_level).sort(d3.ascending);
    const min = d3.min(values);
    const max = d3.max(values);
    const q1 = d3.quantile(values, 0.25);
    const median = d3.quantile(values, .5)
    const q3 = d3.quantile(values, 0.75);
    return {min, max, q1, median, q3};
  };

  const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.stroke);

  quantilesByGroups.forEach((quantiles, stroke) => {
    const x = xscale(stroke);
    const boxWidth = xscale.bandwidth();

    svg.append("line")
      .attr("x1", x + boxWidth / 2)
      .attr("x2", x + boxWidth / 2)
      .attr("y1", yscale(quantiles.max))
      .attr("y2", yscale(quantiles.min))
      .attr("stroke", "black")
      .style("stroke-width", 1.68);

    svg.append("rect")
      .attr("x", x)
      .attr("y", yscale(quantiles.q3))
      .attr("height", yscale(quantiles.q1) - yscale(quantiles.q3))
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", "#fffeee");

    svg.append("line")
      .attr("x1", x)
      .attr("x2", x + boxWidth)
      .attr("y1", yscale(quantiles.median))
      .attr("y2", yscale(quantiles.median))
      .attr("stroke", "black")
      .style("width", 16.8);

    svg.append("line")
      .attr("x1", 42)
      .attr("x2", 646.8)
      .attr("y1", yscale(100))
      .attr("y2", yscale(100))
      .attr("stroke", "green")
      .style("width", 16.8);

    svg.append("line")
      .attr("x1", 42)
      .attr("x2", 646.8)
      .attr("y1", yscale(70))
      .attr("y2", yscale(70))
      .attr("stroke", "green")
      .style("width", 16.8);

    svg.append("line")
      .attr("x1", 42)
      .attr("x2", 42)
      .attr("y1", yscale(70))
      .attr("y2", yscale(100))
      .attr("stroke", "green")
      .style("width", 16.8);

    svg.append("line")
      .attr("x1", 646.8)
      .attr("x2", 646.8)
      .attr("y1", yscale(70))
      .attr("y2", yscale(100))
      .attr("stroke", "green")
      .style("width", 16.8);

    svg.append('text')
      .attr('x', width / 2 - 170.1)
      .attr('y', height - 121.8)
      .text('Typical Glucose Level Range for Healthy People over the age of 16')
      .attr("stroke", "blue")
      .attr("font-size", 12.6)
      .attr("font-weight", 200)

    svg.append("rect")
      .attr("x", 42)
      .attr("y", 504)
      .attr("height", 84)
      .attr("width", 604.8)
      .attr("stroke", "green")
      .style("fill", "green")
      .style("opacity", 0.2)

    svg.append("rect")
      .attr("x", 42)
      .attr("y", 636.72)
      .attr("height", 8.4)
      .attr("width", 604.8)
      .attr("stroke", "white")
      .style("fill", "white")
  });

  svg.append('text')
    .attr('x', width / 2 + 103.32)
    .attr('y', yscale(50))
    .text('No Stroke')
    .attr("font-size", 10.08)
    .attr("font-weight", 400)

  svg.append('text')
    .attr('x', 195.72)
    .attr('y', yscale(50))
    .text('Had Stroke')
    .attr("font-size", 10.08)
    .attr("font-weight", 400)
});
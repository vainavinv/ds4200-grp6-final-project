const stroke = d3.csv("stroke-data.csv");

stroke.then(function (data) {

  // filter data to only include people above 16 years old (like the graph)
  data = data.filter(d => +d.age > 16);

  data.forEach(function (d) {
    d.avg_glucose_level = +d.avg_glucose_level;
  });

  let width = 800, height = 800;

  let margin = {
    top: 30,
    bottom: 50,
    right: 30,
    left: 50
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
    .attr('x', width / 2 - 40)
    .attr('y', height - 15)
    .text('Stroke Status')

  svg.append('text')
    .attr('x', -500)
    .attr('y', 10)
    .text('Average Glucose Level (mg/dL)')
    .attr('transform', 'rotate(-90)')

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
      .style("stroke-width", 2);

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
      .style("width", 20);

    svg.append("line")
      .attr("x1", 50)
      .attr("x2", 770)
      .attr("y1", yscale(100))
      .attr("y2", yscale(100))
      .attr("stroke", "green")
      .style("width", 20);

    svg.append("line")
      .attr("x1", 50)
      .attr("x2", 770)
      .attr("y1", yscale(70))
      .attr("y2", yscale(70))
      .attr("stroke", "green")
      .style("width", 20);

    svg.append("line")
      .attr("x1", 50)
      .attr("x2", 50)
      .attr("y1", yscale(70))
      .attr("y2", yscale(100))
      .attr("stroke", "green")
      .style("width", 20);

    svg.append("line")
      .attr("x1", 770)
      .attr("x2", 770)
      .attr("y1", yscale(70))
      .attr("y2", yscale(100))
      .attr("stroke", "green")
      .style("width", 20);

    svg.append('text')
      .attr('x', width / 2 - 203)
      .attr('y', height - 145)
      .text('Typical Glucose Level Range for Healthy People over the age of 16')
      .attr("stroke", "blue")
      .attr("font-size", 15)
      .attr("font-weight", 200)

    svg.append("rect")
      .attr("x", 50)
      .attr("y", 600)
      .attr("height", 100)
      .attr("width", 770 - 50)
      .attr("stroke", "green")
      .style("fill", "green")
      .style("opacity", 0.2)

    svg.append("rect")
      .attr("x", 50)
      .attr("y", 758)
      .attr("height", 10)
      .attr("width", 770 - 50)
      .attr("stroke", "white")
      .style("fill", "white")
  });

  svg.append('text')
    .attr('x', width / 2 - 230)
    .attr('y', 0)
    .text('Average Glucose Level by Stroke Status for People over the age of 16')

  svg.append('text')
    .attr('x', width / 2 + 123)
    .attr('y', yscale(50))
    .text('No Stroke')
    .attr("font-size", 12)
    .attr("font-weight", 400)

  svg.append('text')
    .attr('x', 233)
    .attr('y', yscale(50))
    .text('Had Stroke')
    .attr("font-size", 12)
    .attr("font-weight", 400)
});
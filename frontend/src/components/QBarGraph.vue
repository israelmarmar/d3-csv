<template>
  <div id="qbargraph"></div>
  <div>
    <h2>{{ label }}</h2>
    <svg id="freqgraph"></svg>
  </div>
</template>
<script>
import { isProxy, toRaw } from 'vue';
import * as d3 from "d3";

export default {
  data() {
    return {};
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    values: {
      type: Array,
      required: true
    }
  },
  mounted() {
    const width = 1000;
    const height = 500;
    const marginTop = 30;

    const marginBottom = 30;
    const marginLeft = 45;

    let data = this.values;


    if (isProxy(this.values)) {
      data = toRaw(data)
    }

    var tooltip = d3.select("#qbargraph")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "relative")
      .style("background-color", "black")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("width", "150px")


    const showTooltip = (event, d) => {

      tooltip
        .transition()
        .duration(100)
        .style("opacity", 1)
      tooltip
        .html("Frequencia: " + d.quantity)
        .style("left", (d3.pointer(event)[0]+350) + "px")
        .style("top", (d3.pointer(event)[1]+65) + "px")
  
    }

    // eslint-disable-next-line
    const moveTooltip = (event, d) => {
      tooltip
        .style("left", (d3.pointer(event)[0]+350) + "px")
        .style("top", (d3.pointer(event)[1]+65) + "px")
    }

    // eslint-disable-next-line
    const hideTooltip = (event, d) => {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0)
    }

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.value))
      .range([0, width])
      .padding(0.4);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.quantity)])
      .range([height - marginBottom, marginTop]);


    // Create the SVG container.
    const svg = d3.select(`#freqgraph`)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.value))
      .attr("y", (d) => y(d.quantity))
      .attr("height", (d) => y(0) - y(d.quantity))
      .attr("width", 50)
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickFormat((y) => y.toFixed()))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Frequencia"));
  },
};
</script>
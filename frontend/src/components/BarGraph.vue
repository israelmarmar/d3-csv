<template>
  <div>
    <div :id="id + 'graph'"></div>
    <h2>{{ label }}</h2>
    <svg :id="id + 'svg'"></svg>
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
    color: {
      type: String
    },
    id: {
      type: String,
      required: true,
    },
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
    const height = 1000;
    const marginTop = 30;

    const marginBottom = 30;
    const marginLeft = 45;

    let data = this.values;

    if (isProxy(this.values)) {
      data = toRaw(data)
    }

    if (data.allData) {
      data = toRaw(data.allData)
    }

    console.log(data);

    var tooltip = d3.select(`#${this.id}graph`)
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
        .html("Valor: " + d.amount.toFixed(2))
        .style("left", (d3.pointer(event)[0] + 350) + "px")
        .style("top", (d3.pointer(event)[1] + 65) + "px")

    }

    // eslint-disable-next-line
    const moveTooltip = (event, d) => {
      tooltip
        .style("left", (d3.pointer(event)[0] + 350) + "px")
        .style("top", (d3.pointer(event)[1] + 65) + "px")
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
      .domain(data.map(d => d.date))
      .range([0, width])
      .padding(0.4);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
      .domain([-d3.max(data, (d) => d.amount), d3.max(data, (d) => d.amount)])
      .range([height - marginBottom, marginTop]);


    // Create the SVG container.
    const svg = d3.select(`#${this.id}svg`)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
      .selectAll()
      .data(data)
      .join("rect")
      .attr("fill", (d) => d.amount > 0 ? this.color : 'red')
      .attr("x", (d) => x(d.date))
      .attr("y", (d) => y(Math.max(0, d.amount)))
      .attr("height", (d) => Math.abs(y(0) - y(d.amount)))
      .attr("width", 50)
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip);

    svg.append("g")
      .attr("transform", `translate(0,${height / 2})`)
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
        .text("Valor (R$)"));
  },
};
</script>
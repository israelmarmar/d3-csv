<template>
  <div>
    <h2>{{ label }}</h2>
    <svg id="freqgraph"></svg>
  </div>
</template>
<script>
import { isProxy, toRaw } from 'vue';
import * as d3 from "d3";

function countMap(data) {
  const count = {};

  for (let i = 0; i < data.length; i++) {
    count[data[i]] = count[data[i]] ? count[data[i]] + 1 : 1;
  }

  return Object.keys(count).map(key => Object.assign({ quantity: count[key], value: parseInt(key) }));
}

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

    data = countMap(data);

    console.log('data', data)

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
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./BarChart.css";

const BarChart = ({ spectatorsData, sessionsData }) => {
  const [selectedMetric, setSelectedMetric] = useState("spectators");
  const [yearRange, setYearRange] = useState([1950, 2023]);
  const chartRef = useRef(null);

  useEffect(() => {
    drawBarChart();
  }, [selectedMetric, yearRange]);

  const drawBarChart = () => {
    const margin = { top: 20, right: 40, bottom: 50, left: 50 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const data =
      selectedMetric === "spectators"
        ? spectatorsData.filter((d) => d.Year >= yearRange[0] && d.Year <= yearRange[1])
        : sessionsData.filter((d) => d.Year >= yearRange[0] && d.Year <= yearRange[1]);

    // Clear previous chart
    d3.select("#bar-chart").selectAll("*").remove();

    const svg = d3
      .select("#bar-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(d3.range(yearRange[0], yearRange[1] + 1)) 
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => (selectedMetric === "spectators" ? d["Spectators (Thousands)"] : d["Number of Cinema Sessions"]))])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((year) => year % 5 === 0)))
      .selectAll("text")
      .attr("transform", "rotate(-20)")
      .style("text-anchor", "end")
      .style("font-size", "12px");

    svg.append("g").call(d3.axisLeft(y).ticks(5));

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.Year))
      .attr("y", (d) => y(selectedMetric === "spectators" ? d["Spectators (Thousands)"] : d["Number of Cinema Sessions"]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(selectedMetric === "spectators" ? d["Spectators (Thousands)"] : d["Number of Cinema Sessions"]))
      .style("fill", "steelblue")
      .style("border-radius", "5px");

    svg
      .selectAll(".bar")
      .on("mouseover", function (event, d) {
        d3.select(this).style("fill", "#FF5733"); // Change color on hover
      })
      .on("mouseout", function (event, d) {
        d3.select(this).style("fill", "steelblue"); // Revert back on mouseout
      });
  };

  return (
    <div className="bar-chart-container" ref={chartRef}>
      <div className="bar-chart-controls">
        <label htmlFor="metric-selector">Select Metric:</label>
        <select id="metric-selector" value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
          <option value="spectators">Spectators</option>
          <option value="sessions">Sessions</option>
        </select>

        <label htmlFor="start-year">Start Year:</label>
        <input
          id="start-year"
          type="number"
          min="1950"
          max="2023"
          value={yearRange[0]}
          onChange={(e) => setYearRange([+e.target.value, yearRange[1]])}
        />
        <label htmlFor="end-year">End Year:</label>
        <input
          id="end-year"
          type="number"
          min="1950"
          max="2023"
          value={yearRange[1]}
          onChange={(e) => setYearRange([yearRange[0], +e.target.value])}
        />
      </div>

      <div id="bar-chart" className="bar-chart"></div>
    </div>
  );
};

export default BarChart;

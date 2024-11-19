import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./BarChart.css";

const BarChart = ({ spectatorsData, venuesData, sessionsData, revenueData }) => {
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
  
    // Choose the correct dataset based on the selected metric and filter by year range
    const data = (() => {
      if (selectedMetric === "spectators") {
        return spectatorsData.filter((d) => d.Year >= yearRange[0] && d.Year <= yearRange[1]);
      } else if (selectedMetric === "venues") {
        return venuesData.filter((d) => d.Year >= yearRange[0] && d.Year <= yearRange[1]);
      } else if (selectedMetric === "sessions") {
        return sessionsData.filter((d) => d.Year >= yearRange[0] && d.Year <= yearRange[1]);
      } else if (selectedMetric === "revenue") {
        return revenueData.filter((d) => d.Year >= yearRange[0] && d.Year <= yearRange[1]);
      }
      return [];
    })();
  
    // Sort data by Year in ascending order
    const sortedData = data.sort((a, b) => a.Year - b.Year);
  
    // Clear the previous chart
    d3.select("#bar-chart").selectAll("*").remove();
  
    const svg = d3
      .select("#bar-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Set up x-axis and y-axis scales
    const x = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.Year)) // Use sortedData for ordered years
      .range([0, width])
      .padding(0.2);
  
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(sortedData, (d) => {
          if (selectedMetric === "spectators") return d["Spectators (Thousands)"];
          if (selectedMetric === "venues") return d["Number of Cinema Venues"];
          if (selectedMetric === "sessions") return d["Number of Cinema Sessions"];
          if (selectedMetric === "revenue") return d["Cinema Revenue (Thousands of Euros)"];
          return 0;
        }),
      ])
      .nice()
      .range([height, 0]);
  
    // Draw x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((year) => year % 5 === 0)))
      .selectAll("text")
      .attr("transform", "rotate(-20)")
      .style("text-anchor", "end")
      .style("font-size", "12px");
  
    // Draw y-axis
    svg.append("g").call(d3.axisLeft(y).ticks(5));
  
    // Draw bars
    svg
      .selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.Year))
      .attr("y", (d) => y(
        selectedMetric === "spectators"
          ? d["Spectators (Thousands)"]
          : selectedMetric === "venues"
          ? d["Number of Cinema Venues"]
          : selectedMetric === "sessions"
          ? d["Number of Cinema Sessions"]
          : d["Cinema Revenue (Thousands of Euros)"]
      ))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(
        selectedMetric === "spectators"
          ? d["Spectators (Thousands)"]
          : selectedMetric === "venues"
          ? d["Number of Cinema Venues"]
          : selectedMetric === "sessions"
          ? d["Number of Cinema Sessions"]
          : d["Cinema Revenue (Thousands of Euros)"]
      ))
      .style("fill", "steelblue");
  
    // Add hover effect
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
          <option value="venues">Venues</option>
          <option value="sessions">Sessions</option>
          <option value="revenue">Revenue</option>
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

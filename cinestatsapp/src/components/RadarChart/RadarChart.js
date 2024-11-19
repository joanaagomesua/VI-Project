import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./RadarChart.css";

const RadarChart = ({ data, year }) => {
    const chartRef = useRef(null);
  
    useEffect(() => {
      drawRadarChart();
    }, [data, year]);
  
    const drawRadarChart = () => {
      const metrics = ["Spectators", "Sessions"];
      const selectedYearData = data.find((d) => d.Year === year);
  
      if (!selectedYearData) return;
  
      const formattedData = metrics.map((metric) => ({
        axis: metric,
        value: selectedYearData[metric], // Directly use the value of Spectators and Sessions
      }));
  
      const containerWidth = chartRef.current.offsetWidth;
      const width = Math.min(containerWidth, 400);
      const height = width;
      const radius = Math.min(width, height) / 2;
      const levels = 5;
  
      // Clear previous chart
      d3.select("#radar-chart").selectAll("*").remove();
  
      const svg = d3
        .select("#radar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
      // Scales
      const radialScale = d3
        .scaleLinear()
        .domain([0, d3.max(formattedData, (d) => d.value)])
        .range([0, radius]);
  
      // Axes
      const angleSlice = (2 * Math.PI) / metrics.length;
      svg
        .selectAll(".axis")
        .data(metrics)
        .enter()
        .append("g")
        .attr("class", "radar-axis")
        .each(function (d, i) {
          const x = radialScale(d3.max(formattedData, (d) => d.value)) * Math.cos(angleSlice * i - Math.PI / 2);
          const y = radialScale(d3.max(formattedData, (d) => d.value)) * Math.sin(angleSlice * i - Math.PI / 2);
          d3.select(this)
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", x)
            .attr("y2", y)
            .style("stroke", "gray");
          d3.select(this)
            .append("text")
            .attr("x", x * 1.1)
            .attr("y", y * 1.1)
            .text(d)
            .style("text-anchor", "middle");
        });
  
      // Levels
      for (let i = 1; i <= levels; i++) {
        const r = (radius / levels) * i;
        svg
          .append("circle")
          .attr("class", "radar-grid")
          .attr("r", r)
          .style("fill", "none")
          .style("stroke", "#CDCDCD");
      }
  
      // Data
      const line = d3
        .lineRadial()
        .radius((d) => radialScale(d.value))
        .angle((d, i) => i * angleSlice);
  
      svg
        .append("path")
        .datum(formattedData)
        .attr("d", line)
        .attr("class", "radar-chart-area")
        .style("fill", "steelblue")
        .style("opacity", 0.6);
  
      // Points
      svg
        .selectAll(".radar-point")
        .data(formattedData)
        .enter()
        .append("circle")
        .attr("class", "radar-point")
        .attr("cx", (d, i) => radialScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => radialScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("r", 4)
        .style("fill", "#fff")
        .style("stroke", "steelblue");
    };
  
    return (
      <div className="radar-chart-container">
        <h2 className="radar-chart-title">Radar Chart for {year}</h2>
        <div id="radar-chart" ref={chartRef}></div>
      </div>
    );
  };
  

export default RadarChart;

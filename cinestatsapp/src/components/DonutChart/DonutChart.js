import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./DonutChart.css";

const DonutChart = ({ spectatorsData }) => {
  const [selectedYear, setSelectedYear] = useState(2005); // Default year
  const [selectedRegions, setSelectedRegions] = useState([]); // Array to store selected regions
  const [chartData, setChartData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);


  const regionNameMap = {
    "Região Autónoma dos Açores": "Açores",
    "Região Autónoma da Madeira": "Madeira",
  };
  // Function to handle year selection change
  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value)); // Update selected year
  };

  // Function to handle checkbox change for regions
  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegions((prevSelectedRegions) => {
      if (prevSelectedRegions.includes(region)) {
        // Remove region if it's already selected
        return prevSelectedRegions.filter((r) => r !== region);
      } else {
        // Add region if it's not already selected
        return [...prevSelectedRegions, region];
      }
    });
  };

  useEffect(() => {
    if (spectatorsData && spectatorsData.length > 0) {
      // Filter out "Portugal" and "Continente" regions, then filter based on selected regions
      const filteredData = spectatorsData
        .filter(
          (region) =>
            region.Location !== "Portugal" && region.Location !== "Continente" &&
            (selectedRegions.length === 0 || selectedRegions.includes(region.Location))
        );

      // Prepare the data for the donut chart based on selected year
      const processedData = filteredData.map((region) => ({
        region: regionNameMap[region.Location] || region.Location,
        value: region[selectedYear], // Use the selected year
      }));

      setChartData(processedData);

      // Calculate the total value for Portugal
      const portugalData = spectatorsData.find(
        (region) => region.Location === "Portugal"
      );
      const total = portugalData ? portugalData[selectedYear] : 0;
      setTotalValue(total);

    }
  }, [spectatorsData, selectedYear, selectedRegions]);

  useEffect(() => {
    if (chartData.length > 0) {
      drawChart();
    }
  }, [chartData]);

  const drawChart = () => {
    const width = 500;
    const height = 500;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Remove existing SVG element
    d3.select("#donut-chart").selectAll("*").remove();

    // Create SVG element
    const svg = d3
      .select("#donut-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create a pie chart generator
    const pie = d3.pie().value((d) => d.value);

    const arc = d3.arc().innerRadius(radius - 50).outerRadius(radius);

    const pieData = pie(chartData);

    // Tooltip element
    const tooltip = d3
      .select("#donut-chart")
      .append("div")
      .attr("class", "tooltip")
      .style("visibility", "hidden");

    svg
      .selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.7);

        // Calculate percentage
        const percentage =
        totalValue > 0 ? ((d.data.value / totalValue) * 100).toFixed(2) : 0;

        // Display the tooltip
        tooltip
          .style("visibility", "visible")
          .html(`<strong>${d.data.region}</strong><br/>${d.data.value} spectators (${percentage}%)`
        );
      })
      .on("mousemove", function (event) {
        // Position the tooltip near the mouse
        tooltip
          .style("top", `${event.pageY + 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);

        // Hide the tooltip
        tooltip.style("visibility", "hidden");
      });

    // Add labels to each section, conditionally hide labels for small slices
    svg
      .selectAll("text")
      .data(pieData)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text((d) => {
        // If the slice angle is too small, don't show the label
        const sliceAngle = d.endAngle - d.startAngle;
        return sliceAngle > 0.2 ? d.data.region : ''; // Only show label if the slice is large enough
      })
      .style("font-size", "12px")
      .style("fill", "white");
  };

  return (
    <div className="donut-chart-container">
      {/* Year Selector */}
      <div className="year-selector">
        <label htmlFor="year">Select Year:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {/* Generate options dynamically based on available years */}
          {Object.keys(spectatorsData[0] || {})
            .filter((key) => key !== "Location") // Filter out the 'Location' key
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>

      {/* Region Selector with checkboxes */}
      <div className="region-selector">
        <label>Select Regions:</label>
        <div className="region-selector-checkbox">
          {/* Create a checkbox for each region */}
          {spectatorsData
            .filter(
              (region) =>
                region.Location !== "Portugal" &&
                region.Location !== "Continente" &&
                region[selectedYear] > 0 // Exclude regions with 0 spectators for the selected year
            )
            .map((region) => (
              <div key={region.Location}>
                <input
                  type="checkbox"
                  id={region.Location}
                  value={region.Location}
                  checked={selectedRegions.includes(region.Location)}
                  onChange={handleRegionChange}
                />
                <label htmlFor={region.Location}>
                  {regionNameMap[region.Location] || region.Location}
                </label>
              </div>
            ))}
        </div>
      </div>
        {/* Donut Chart Area */}
        <div className="donut-chart" id="donut-chart" />
    </div>
  );
};

export default DonutChart;

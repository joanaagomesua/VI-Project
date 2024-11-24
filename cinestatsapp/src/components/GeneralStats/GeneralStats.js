import React, { useEffect, useState } from "react";
import "./GeneralStats.css";
import * as d3 from "d3";
import BarChart from "../BarChart/BarChart";
import DonutChart from "../DonutChart/DonutChart";

const GeneralStats = ({ spectatorsData, spectatorsDataRegions, venuesData ,sessionsData , revenueData}) => {
  const [selectedMetrics, setSelectedMetrics] = useState({
    spectators: true,
    venues: true,
    sessions: true,
    revenue: true,
  });
  const [yearRange, setYearRange] = useState([1950, 2023]); // Default year range
  const [filteredData, setFilteredData] = useState({
    spectators: [],
    venues: [],
    sessions: [],
    revenue: [],
  });

  const [showMultiline, setShowMultiline] = useState(true);

  const handleYearChange = (newYearRange) => {
    setYearRange(newYearRange);
  };
  const [normalizeData, setNormalizeData] = useState(true);


  useEffect(() => {

    const filteredSpectatorsData = Array.isArray(spectatorsData)
      ? spectatorsData.filter((data) => data.Year >= yearRange[0] && data.Year <= yearRange[1])
      : [];
    
    const filteredVenuesData = Array.isArray(venuesData)
      ? venuesData.filter((data) => data.Year >= yearRange[0] && data.Year <= yearRange[1])
      : [];
    
    const filteredSessionsData = Array.isArray(sessionsData)
      ? sessionsData.filter((data) => data.Year >= yearRange[0] && data.Year <= yearRange[1])
      : [];
    
    const filteredRevenueData = Array.isArray(revenueData)
      ? revenueData.filter((data) => data.Year >= yearRange[0] && data.Year <= yearRange[1])
      : [];
  
    setFilteredData({
      spectators: filteredSpectatorsData,
      venues: filteredVenuesData,
      sessions: filteredSessionsData,
      revenue: filteredRevenueData,
    });
  }, [spectatorsData, venuesData, sessionsData, revenueData, yearRange]);

  useEffect(() => {
    if (
      filteredData.spectators.length > 0 ||
      filteredData.venues.length > 0 ||
      filteredData.sessions.length > 0 ||
      filteredData.revenue.length > 0
    ) {
      drawChart();
    }
  }, [filteredData, selectedMetrics,normalizeData]);

  useEffect(() => {
    if (showMultiline) {
      drawChart();
    }
  }, [showMultiline]); 
  

  const handleMetricChange = (metric) => {
    setSelectedMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  const drawChart = () => {
    if (!filteredData || (!selectedMetrics.spectators && !selectedMetrics.sessions && !selectedMetrics.venues && !selectedMetrics.revenue)) {
      d3.select("#chart").selectAll("*").remove(); // Clear the chart if no metrics selected
      return;
    }

    // Define a color scale
    const colorScale = d3.scaleOrdinal()
      .domain(["Spectators", "Venues", "Sessions", "Revenue"])
      .range(["blue", "orange", "green", "red"]);

    const { spectators, venues, sessions, revenue } = filteredData;
  
    const data = [];
    const baseYear = yearRange[0]; // Use the start of the selected year range as the base year
  
    if (selectedMetrics.spectators) {
      if (normalizeData) {
        const baseValue = spectators.find((d) => d.Year === baseYear)?.["Spectators (Thousands)"] || 1;
        data.push({
          name: "Spectators",
          values: spectators.map((d) => ({
            year: new Date(d.Year, 0, 1),
            value: (d["Spectators (Thousands)"] / baseValue) * 100,
          })),
        });
      } else {
        data.push({
          name: "Spectators",
          values: spectators.map((d) => ({
            year: new Date(d.Year, 0, 1),
            value: d["Spectators (Thousands)"],
          })),
        });
      }
    }
  
    if (selectedMetrics.venues) {
      if(normalizeData){
        const baseValue = venues.find((d) => d.Year === baseYear)?.["Number of Cinema Venues"] || 1;
        data.push({
          name: "Venues",
          values: venues.map((d) => ({
            year: new Date(d.Year, 0, 1),
            value: (d["Number of Cinema Venues"] / baseValue) * 100,
          })),
        });
      }
      else{
        data.push({
          name: "Venues",
          values: venues.map((d) => ({
            year: new Date(d.Year, 0, 1),
            value: (d["Number of Cinema Venues"] ) 
          })),
        });
      }
    }
  
    if (selectedMetrics.sessions) {
      if(normalizeData){
        const baseValue = sessions.find((d) => d.Year === baseYear)?.["Number of Cinema Sessions"] || 1;
        data.push({
          name: "Sessions",
          values: sessions.map((d) => ({
            year: new Date(d.Year, 0, 1),
            value: (d["Number of Cinema Sessions"] / baseValue) * 100,
          })),
        });
      }else{
        data.push({
          name: "Sessions",
          values: sessions.map((d) => ({
            year: new Date(d.Year, 0, 1),
            value: (d["Number of Cinema Sessions"] ) 
          })),
        });
      }
    }
  
    if (selectedMetrics.revenue) {
      if(normalizeData){
        const baseValue = revenue.find((d) => d.Year === baseYear)?.["Cinema Revenue (Thousands of Euros)"] || 1;
        data.push({
          name: "Revenue",
          values: revenue.map((d) => ({
            year: new Date(d.Year, 0, 1),
            value: (d["Cinema Revenue (Thousands of Euros)"] / baseValue) * 100,
          })),
        });
      }
      else{
        data.push({
          name: "Revenue",
          values: revenue.map((d) => ({
            year: new Date(d.Year, 0, 1),
            value: (d["Cinema Revenue (Thousands of Euros)"] ) 
          })),
        });
      }
    }
  
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
  
    d3.select("#chart").selectAll("*").remove();
  
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const x = d3.scaleTime()
      .domain([new Date(yearRange[0], 0, 1), new Date(yearRange[1], 0, 1)])
      .range([0, width]);
  
    const y = d3.scaleLinear()
      .domain([
        d3.min(data.flatMap((d) => d.values.map((v) => v.value))) - 10,
        d3.max(data.flatMap((d) => d.values.map((v) => v.value))) + 10,
      ]).nice()
      .range([height, 0]);
  
    const line = d3.line()
      .x((d) => x(d.year))
      .y((d) => y(d.value));
  
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeYear.every(5)).tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-20)");
  
    svg.append("g").call(d3.axisLeft(y));
  
    data.forEach((series) => {
      svg.append("path")
        .data([series.values])
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", series.name === "Spectators"
          ? "blue"
          : series.name === "Venues"
          ? "orange"
          : series.name === "Sessions"
          ? "green"
          : "red")
        .style("stroke-width", 2)
        .style("fill", "none");
    });

    // Remove any existing legend
    svg.selectAll(".legend").remove();

    // Add legend
    const legend = svg.selectAll(".legend")
      .data(data)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 40})`);

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d) => colorScale(d.name));

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => d.name);
      };
  

  return (
    <div>
      <h1 className="title">General Stats</h1>
      <p className="description">
        Explore the trends in cinema sessions, spectators, revenue, and venues over the years in Portugal.
      </p>
      {/* Chart Toggle Button */}
      <div className="chart-toggle">
        <button
          className={`toggle-btn ${showMultiline ? "active" : ""}`}
          onClick={() => setShowMultiline(true)}
        >
          Multiline Chart
        </button>
        <button
          className={`toggle-btn ${!showMultiline ? "active" : ""}`}
          onClick={() => setShowMultiline(false)}
        >
          Bar Chart
        </button>
      </div>
      <div className="general-stats">
        <div className="general-stats-container">
          <h2>Evolution over Time</h2>
          {showMultiline ? (
            <>
              {/* Year Range Filter */}
              <div className="year-range">
                <label htmlFor="start-year">Start Year:</label>
                <input
                  id="start-year"
                  type="number"
                  min="1950"
                  max="2023"
                  value={yearRange[0]}
                  onChange={(e) => handleYearChange([+e.target.value, yearRange[1]])}
                />
                <label htmlFor="end-year">End Year:</label>
                <input
                  id="end-year"
                  type="number"
                  min="1950"
                  max="2023"
                  value={yearRange[1]}
                  onChange={(e) => handleYearChange([yearRange[0], +e.target.value])}
                />
                <div className="normalization-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={normalizeData}
                      onChange={() => setNormalizeData(!normalizeData)}
                      className="metric-checkbox"
                    />
                    Normalize Data (Base Year = {yearRange[0]})
                  </label>
                </div>
              </div>

              {/* Metric Selection Controls */}
              <div className="metric-selection">
                <label className="metric-label">
                  <input
                    type="checkbox"
                    checked={selectedMetrics.spectators}
                    onChange={() => handleMetricChange("spectators")}
                    className="metric-checkbox"
                  />
                  Spectators
                </label>
                <label className="metric-label">
                  <input
                    type="checkbox"
                    checked={selectedMetrics.sessions}
                    onChange={() => handleMetricChange("sessions")}
                    className="metric-checkbox"
                  />
                  Sessions
                </label>
                <label className="metric-label">
                  <input
                    type="checkbox"
                    checked={selectedMetrics.venues}
                    onChange={() => handleMetricChange("venues")}
                    className="metric-checkbox"
                  />
                  Venues
                </label>
                <label className="metric-label">
                  <input
                    type="checkbox"
                    checked={selectedMetrics.revenue}
                    onChange={() => handleMetricChange("revenue")}
                    className="metric-checkbox"
                  />
                  Revenue
                </label>
              </div>


              {/* Chart Area */}
              <div id="chart" className="chart-container"></div>
            </>
          ) : (
            <div>
              <BarChart
                spectatorsData={spectatorsData}
                sessionsData={sessionsData}
                venuesData={venuesData}
                revenueData={revenueData}
              />

            </div>
          )}
        </div>

        <div className="genstats-right-chart">
          <h2>Spectators by Region</h2>
          <DonutChart
            spectatorsData={spectatorsDataRegions} // Pass the regions' data to DonutChart
          />
        </div>


      </div>
    </div>
  );

};

export default GeneralStats;

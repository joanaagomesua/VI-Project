import React, { useEffect, useState } from "react";
import "./GeneralStats.css";
import * as d3 from "d3";
import BarChart from "../BarChart/BarChart";

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

  useEffect(() => {

    console.log("Venue Data:", venuesData);

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
  }, [filteredData, selectedMetrics]);

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
  
    const { spectators, venues, sessions, revenue } = filteredData;
  
    const data = [];
  
    if (selectedMetrics.spectators) {
      data.push({
        name: "Spectators",
        values: spectators.map((d) => ({
          year: new Date(d.Year, 0, 1),
          value: d["Spectators (Thousands)"],
        })),
      });
    }
  
    if (selectedMetrics.venues) {
      data.push({
        name: "Venues",
        values: venues.map((d) => ({
          year: new Date(d.Year, 0, 1),
          value: d["Number of Cinema Venues"],
        })),
      });
    }
  
    if (selectedMetrics.sessions) {
      data.push({
        name: "Sessions",
        values: sessions.map((d) => ({
          year: new Date(d.Year, 0, 1),
          value: d["Number of Cinema Sessions"],
        })),
      });
    }
  
    if (selectedMetrics.revenue) {
      data.push({
        name: "Revenue",
        values: revenue.map((d) => ({
          year: new Date(d.Year, 0, 1),
          value: d["Cinema Revenue (Thousands of Euros)"],
        })),
      });
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
      .domain([0, d3.max(data.flatMap((d) => d.values.map((v) => v.value)))]).nice()
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
  };
  
  

  return (
    <div>
      <h1 className="title">General Stats</h1>
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

        </div>


      </div>
    </div>
  );

};

export default GeneralStats;

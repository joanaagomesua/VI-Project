import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const MapBubbleChart = () => {
  const svgRef = useRef();
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Fetch the GeoJSON file dynamically
    fetch("/VI_Data/ContinenteDistritos.geojson")
      .then((response) => response.json())
      .then((data) =>{
        console.log("Sample GeoJSON coordinates:", data.features[0]?.geometry.coordinates);
        setGeoData(data);
      } )
      .catch((error) => console.error("Error loading GeoJSON data:", error));
  }, []);

  useEffect(() => {

    console.log("Geodata"+ geoData)
    if (!geoData) return; // Only proceed if geoData is loaded

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove(); // Clear any previous drawings

    const projection = d3.geoMercator()
      .center([-8, 39.5]) // Center over Portugal, adjust as needed
      .scale(3000)        // Adjust scale larger or smaller to fit map
      .translate([width / 2, height / 2]);


    const pathGenerator = d3.geoPath().projection(projection);

    // Draw the map regions
    svg.selectAll(".region")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("class", "region")
      .attr("d", d => {
        if (d.geometry && d.geometry.coordinates) {
          return pathGenerator(d);
        }
        console.warn("Skipping invalid feature:", d);
        return null;
      })
      .attr("fill", "#e0e0e0")
      .attr("stroke", "#333");


  }, [geoData]); // This effect runs when geoData changes

  return <svg ref={svgRef}></svg>;
};

export default MapBubbleChart;

import React, { useEffect, useRef, useState,useMemo } from "react";
import * as d3 from "d3";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; // Import the CSS styles
import "./MapBubbleChart.css";

const MapBubbleChart = ({datasets}) => {
  
  // Define the mapping from region to districts
  const regionToDistricts = {
    Norte: ["Porto", "Braga", "Viana do Castelo", "Vila Real", "Bragança"],
    Centro: ["Aveiro", "Coimbra", "Leiria", "Castelo Branco", "Viseu", "Guarda"],
    Lisboa: ["Lisboa", "Setúbal"],
    Alentejo: ["Portalegre", "Évora", "Beja"],
    Algarve: ["Faro"],
    "Região Autónoma dos Açores": ["REGIÃO AUTÓNOMA DOS AÇORES"], // Matches GeoJSON property
    "Região Autónoma da Madeira": [
      "Ilha da Madeira (Madeira)",
      "Ilha de Porto Santo (Madeira)",
    ], 
  };


  const svgRef = useRef();
  const [geoData, setGeoData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2000); // Default year
  const [selectedDatasetIndex, setSelectedDatasetIndex] = useState(0); // Default to first dataset

  const totalValueT = useMemo(() => {
    if (!datasets || datasets.length === 0) return 0;
  
    const currentDataset = datasets[selectedDatasetIndex];
    const mapStatsNested = currentDataset.data;
    const mapStats = mapStatsNested.flat();
  
    // Find the row where Location is 'Portugal'
    const portugalStats = mapStats.find((row) => row.Location === 'Portugal');
  
    if (portugalStats && portugalStats[selectedYear] != null) {
      return portugalStats[selectedYear];
    }
  
    return 0;
  }, [datasets, selectedDatasetIndex, selectedYear]);
  


  useEffect(() => {
    // Fetch the GeoJSON file dynamically
    fetch("/VI_Data/ContinenteDistritos.geojson")
      .then((response) => response.json())
      .then((data) =>{
        setGeoData(data);
      } )
      .catch((error) => console.error("Error loading GeoJSON data:", error));
  }, []);

  useEffect(() => {
    console.log("GeoData:", geoData);
    console.log("DataSets:", datasets);
    if ( !geoData || !datasets || datasets.length === 0) {
      console.warn("Missing geoData or mapStats");
      return;
    }

    const mapStatsNested = datasets[selectedDatasetIndex].data;
    console.log("mapStatsNested:", mapStatsNested);
  
    // Flatten the nested array
    const mapStats = mapStatsNested.flat();
    console.log("Flattened mapStats:", mapStats);

    const width = 1800;
    const height = 1100;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    svg.selectAll("*").remove(); // Clear previous content

    // Create individual projections for mainland, Azores, and Madeira
    const mainlandProjection = d3
      .geoMercator()
      .center([-8, 39.5]) // Center of mainland Portugal
      .scale(6000)
      .translate([width / 2 + 200, height / 2 - 100]);

    const azoresProjection = d3
      .geoMercator()
      .center([-27.8, 38.6]) // Center of the Azores
      .scale(6000)
      .translate([width / 2 - 600, height /2 - 400]); // Adjust these values to position Azores

    const madeiraProjection = d3
      .geoMercator()
      .center([-16.9, 32.7]) // Center of Madeira
      .scale(6000)
      .translate([width / 2 - 400, height / 2 + 200]); // Adjust these values to position Madeira

    // Create separate path generators
    const pathMainland = d3.geoPath().projection(mainlandProjection);
    const pathAzores = d3.geoPath().projection(azoresProjection);
    const pathMadeira = d3.geoPath().projection(madeiraProjection);

    // Draw the regions
    svg
      .selectAll(".region")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("class", "region")
      .attr("d", (d) => {
        try {
          let pathGenerator;
          if (d.properties.Ilha) {
            // Determine if it's Azores or Madeira based on properties
            const ilhaName = d.properties.Ilha.toLowerCase();
            if (
              ["região autónoma dos açores"].includes(ilhaName)
            ) {
              pathGenerator = pathAzores;
            } else if (
              ["ilha da madeira (madeira)", "ilha de porto santo (madeira)"].includes(ilhaName)
            ) {
              pathGenerator = pathMadeira;
            } else {
              console.error("Unknown island:", d.properties.Ilha);
              return null;
            }
          } else {
            pathGenerator = pathMainland;
          }
          return pathGenerator(d);
        } catch (error) {
          console.error("Error rendering path for feature:", d, error);
          return null;
        }
      })
      .attr("fill", (d) => (d.properties.Ilha ? "#FFD700" : "#e0e0e0")) // Differentiate islands by color
      .attr("stroke", "#333");

    // Prepare bubble data for the selected year
    const bubbleData = Object.keys(regionToDistricts)
      .map((region) => {
        const districts = regionToDistricts[region];

        console.log("Region:", region, "Districts:", districts);
        console.log("MapStats", mapStats);
        console.log("MapStats Locations:", mapStats.map((row) => row.Location));
        // Get the value for the selected year from mapStats
        const regionStats = mapStats.find((row) => row.Location === region);
        console.log("Region Stats for", region, ":", regionStats);
        const totalValue = regionStats ? regionStats[selectedYear] : 0;

        // Calculate the average coordinates for the region
        const coordinates = districts
          .map((district) => {
            const districtFeature = geoData.features.find((feature) => {
              if (feature.properties) {
                const isDistritoMatch =
                  feature.properties.Distrito &&
                  feature.properties.Distrito.toLowerCase() ===
                    district.toLowerCase();
                const isIlhaMatch =
                  feature.properties.Ilha &&
                  feature.properties.Ilha.toLowerCase() ===
                    district.toLowerCase();

                if (isDistritoMatch || isIlhaMatch) {
                  console.log("Matched feature:", feature.properties);
                  return true;
                }
              }
              return false;
            });

            if (districtFeature) {
              return d3.geoCentroid(districtFeature);
            }
            console.warn("No match for district:", district);
            return null;
          })
          .filter(Boolean);

        if (coordinates.length === 0) {
          console.warn("No coordinates for region:", region);
          return null;
        }

        // Calculate the average longitude and latitude
        const avgCoordinates = [
          d3.mean(coordinates, (d) => d[0]),
          d3.mean(coordinates, (d) => d[1]),
        ];

        // Calculate percentage of total
        const percentage = totalValueT > 0 ? (totalValue / totalValueT) * 100 : 0;

        console.log(
          "Bubble data for region:",
          region,
          avgCoordinates,
          totalValue
        );

        return {
          region,
          value: totalValue,
          percentage,
          coordinates: avgCoordinates,
        };
      })
      .filter(Boolean);

    const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("display", "none");

    // Draw bubbles
    const bubbleScale = d3
      .scaleSqrt()
      .domain([0, d3.max(bubbleData, (d) => d.value)])
      .range([10, 100]); // Bubble size range

    svg
      .selectAll(".bubble")
      .data(bubbleData)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("cx", (d) => {
        const proj = getProjectionForCoordinates(d.coordinates);
        return proj(d.coordinates)[0];
      })
      .attr("cy", (d) => {
        const proj = getProjectionForCoordinates(d.coordinates);
        return proj(d.coordinates)[1];
      })
      .attr("r", (d) => bubbleScale(d.value))
      .attr("fill", "rgba(255, 127, 14, 0.7)")
      .attr("stroke", "#d62728")
      .attr("stroke-width", 1)
      .attr('data-tooltip-id', 'bubble-tooltip') // Assign a tooltip ID
      .attr('data-tooltip-html', (d) => `<strong>${d.region}</strong><br/>Value: ${Math.round(d.value)}<br/>
                                          Percentage: ${d.percentage.toFixed(2)}%`)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("fill", "rgba(245, 66, 66, 0.8)")
          .attr("stroke", "#ff0000")
          .attr("stroke-width", 2);
      
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("fill", "rgba(66, 135, 245, 0.6)")
          .attr("stroke", "#0056b3")
          .attr("stroke-width", 1);

      });

    // Add text to bubbles
    svg
    .selectAll(".bubble-label")
    .data(bubbleData)
    .enter()
    .append("text")
    .attr("class", "bubble-label")
    .attr("x", (d) => {
      const proj = getProjectionForCoordinates(d.coordinates);
      return proj(d.coordinates)[0];
    })
    .attr("y", (d) => {
      const proj = getProjectionForCoordinates(d.coordinates);
      return proj(d.coordinates)[1];
    })
    .attr("dy", ".35em") // Center text vertically
    .attr("text-anchor", "middle") // Center text horizontally
    .text((d) => Math.round(d.value)) // Round the value for display
    .attr("fill", "#fff")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("text-shadow", "1px 1px 2px rgba(0, 0, 0, 0.5)");

    // Helper function to get the correct projection based on coordinates
    function getProjectionForCoordinates(coordinates) {
      const [x, y] = coordinates;
      if (y < 34 && y > 32 && x < -15 && x > -18) {
        // Madeira
        return madeiraProjection;
      } else if (y < 40 && y > 36 && x < -24 && x > -31) {
        // Azores
        return azoresProjection;
      } else {
        // Mainland
        return mainlandProjection;
      }
    }

  }, [geoData, datasets, selectedDatasetIndex, selectedYear]);

  return (
    <div className="page-container">
      <div className="mapstats-container">
                    {/* Title */}
          <h1 className="map-title">{datasets[selectedDatasetIndex].name}</h1>

              {/* Contextual Phrase */}
              <p className="map-description">{datasets[selectedDatasetIndex].description}</p>
              <p className="map-total">
                Total for Portugal in {selectedYear}: <strong>{totalValueT}</strong>
              </p>
              <div className="controls">
                <div className="dataset-selector">
                  <label htmlFor="dataset-select">Select Dataset: </label>
                  <select
                    id="dataset-select"
                    value={selectedDatasetIndex}
                    onChange={(e) => setSelectedDatasetIndex(parseInt(e.target.value))}
                  >
                    {datasets.map((dataset, index) => (
                      <option key={index} value={index}>
                        {dataset.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="slider-container">
                  <label htmlFor="year-slider">Select Year: {selectedYear}</label>
                  <input
                    id="year-slider"
                    type="range"
                    min="2000"
                    max="2023"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(+e.target.value)}
                  />
                </div>
              </div>
              <svg ref={svgRef}></svg>
              <Tooltip
                id="bubble-tooltip"
                place="top"
                effect="solid"
                backgroundColor="#333"
                textColor="#fff"
              />
      </div>
    </div>
  );
};

export default MapBubbleChart;

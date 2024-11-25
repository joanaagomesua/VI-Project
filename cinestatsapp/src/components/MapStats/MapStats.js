import React, { useEffect, useState } from "react";
import "./MapStats.css";
import MapBubbleChart from "../MapBubbleChart/MapBubbleChart";

const MapStats = ({ mapCapacityData, mapVenueData, mapScreenData }) => {

  console.log("Map Capacity Data:", mapCapacityData);
  console.log("Map Venue Data:", mapVenueData);
  
  const datasets = [
    {
      name: 'Venues Capacity',
      description: 'Total seating capacity of cinema venues across regions.',
      data: [mapCapacityData],
    },
    {
      name: 'Cinema Venues',
      description: 'Number of cinema venues available in each region.',
      data: [mapVenueData],
    },
    {
      name: 'Screens',
      description: 'Total number of cinema screens available in each region.',
      data: [mapScreenData],
    },
  ];

  console.log("Datasets:", datasets);
    return (
      <div>
        <MapBubbleChart 
            datasets = {datasets}/>
      </div>
    );
  };

export default MapStats;
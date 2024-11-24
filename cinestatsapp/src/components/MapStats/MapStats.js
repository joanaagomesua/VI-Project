import React, { useEffect, useState } from "react";
import "./MapStats.css";
import MapBubbleChart from "../MapBubbleChart/MapBubbleChart";

const MapStats = ({ mapCapacityData, mapVenueData }) => {

  console.log("Map Capacity Data:", mapCapacityData);
  console.log("Map Venue Data:", mapVenueData);
  
  const datasets = [
    {
      name: 'Lotação dos recintos',
      data: [mapCapacityData],
    },
    {
      name: 'Recintos de Cinema',
      data: [mapVenueData],
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
import React, { useEffect, useState } from "react";
import "./MapStats.css";
import MapBubbleChart from "../MapBubbleChart/MapBubbleChart";

const MapStats = ({ mapData }) => {
    return (
      <div>
        <h2>Map Statistics</h2>
        <MapBubbleChart/>
      </div>
    );
  };

export default MapStats;
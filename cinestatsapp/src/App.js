import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AboutUs from './components/AboutUs/AboutUs';
import GeneralStats from "./components/GeneralStats/GeneralStats"; 
import MapStats from "./components/MapStats/MapStats";
import Papa from "papaparse";

function App() {

  const [theme, setTheme] = useState('light');
  const [spectatorsData, setSpectatorsData] = useState([]);
  const[spectatorsDataRegions, setSpectatorsDataRegions] = useState([]);
  const [venuesData, setVenuesData] = useState([]);
  const [sessionsData, setSessionsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [mapData, setMapData] = useState([]);


  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Function to load CSV data
  const loadCSVData = (filePath, setData) => {
    Papa.parse(filePath, {
      download: true,
      header: true,  // Use the first row as column headers
      dynamicTyping: true,  // Automatically convert to numbers where possible
      complete: (result) => {
        console.log(`CSV data loaded from ${filePath}:`, result.data); // Log loaded data
        setData(result.data);
      },
      error: (error) => {
        console.error("Error loading CSV file:", error);
      },
    });
  };

  useEffect(() => {
    loadCSVData("/VI_Data/INE 1950-2023 Espetadores(anual).csv", setSpectatorsData);
    loadCSVData("/VI_Data/INE 2000-2023 Espetadores Cinema(localização - NUTS II).csv", setSpectatorsDataRegions);
    loadCSVData("/VI_Data/INE 1950-2023 Recintos de Cinema(anual).csv", setVenuesData);
    loadCSVData("/VI_Data/INE 1950-2023 Sessões de Cinema(anual).csv", setSessionsData);
    loadCSVData("/VI_Data/INE 1950-2023 Receitas Cinema(anual).csv", setRevenueData);
    loadCSVData("/VI_Data/INE 2000-2005 Lotação Recintos de Cinema(localização - NUTS II).csv", setMapData);

  }, []);

  return (
    <div className="App">
      <Navbar  theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/aboutus" element={<AboutUs />} />
        <Route
          path="/"
          element={
            <GeneralStats
              spectatorsData={spectatorsData}
              spectatorsDataRegions={spectatorsDataRegions}
              venuesData={venuesData}
              sessionsData={sessionsData}
              revenueData={revenueData}
            />
          }
        />
        <Route path="/mapstats" element={<MapStats mapData={mapData} />} />
        
      </Routes>
    </div>
  );
}

export default App;
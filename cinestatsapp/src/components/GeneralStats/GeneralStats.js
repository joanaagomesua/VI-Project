const GeneralStats = ({ spectatorsData, venuesData, sessionsData }) => {
    return (
        <div>
          <h2>General Cinema Statistics</h2>
    
          <h3>Spectators Data</h3>
          {spectatorsData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(spectatorsData[0]).map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spectatorsData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell !== null ? cell : "N/A"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading spectators data...</p>
          )}
    
          <h3>Venues Data</h3>
          {venuesData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(venuesData[0]).map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {venuesData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell !== null ? cell : "N/A"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading venues data...</p>
          )}
    
          <h3>Sessions Data</h3>
          {sessionsData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(sessionsData[0]).map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessionsData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell !== null ? cell : "N/A"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading sessions data...</p>
          )}
        </div>
      );
};

export default GeneralStats;
import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [sensorData, setSensorData] = useState([]);
  const [error, setError] = useState(null);

  const fetchSensorData = async () => {
    try {
      const res = await fetch('http://localhost:8080/sensor-data');
      if (!res.ok) {
        throw new Error('Failed to fetch sensor data');
      }
      const data = await res.json();
      setSensorData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    // initial fetch
    fetchSensorData();

    // Set up polling every 10 seconds
    const intervalId = setInterval(fetchSensorData, 10000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Sensor Data</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {sensorData.length > 0 ? (
          sensorData.map((data, index) => (
            <li key={index}>
              <strong>Timestamp:</strong> {data.Timestamp}
              <strong>&nbsp;&nbsp;&nbsp;Temperature:</strong> {data.Temperature} °C
              <strong>&nbsp;&nbsp;&nbsp;Humidity:</strong> {data.Humidity} %
              <strong>&nbsp;&nbsp;&nbsp;moisture:</strong> {data.Moisture} %
            </li>
          ))
        ) : (
          <p>No sensor data available.</p>
        )}
      </ul>
    </div>
  );
};

export default HomePage;

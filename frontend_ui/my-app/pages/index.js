import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [sensorData, setSensorData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch sensor data already stored in the .csv file
  const fetchInitialSensorData = async () => {
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
    // Fetch the initial data when the component mounts
    fetchInitialSensorData();

    // Open WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const newSensorData = JSON.parse(event.data);
      console.log('Received data:', newSensorData);
      setSensorData((prevData) => [...prevData, newSensorData]);
    };

    // Cleanup WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Sensor Data</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {sensorData.map((data, index) => (
          <li key={index}>
            Temperature: {data.temperature}, Humidity: {data.humidity}, Moisture: {data.moisture}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;

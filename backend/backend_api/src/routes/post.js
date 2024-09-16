const path = require('path');
const csvWriter = require('csv-writer');


// Define the file path
const filePath = path.join(__dirname, '../data/sensor_data.csv');

// Create the CSV writer instance
const csvWriterInstance = csvWriter.createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'temperature', title: 'Temperature' },
      { id: 'humidity', title: 'Humidity' },
      { id: 'moisture', title: 'Moisture' }
    ],
    append: true // Append data instead of overwriting
  });
 

/**
 * Accept sensor data and store it in a .CSV file
 */
module.exports = (req, res) => {
  const { temperature, humidity, moisture } = req.body;

  if (temperature === undefined || humidity === undefined || moisture === undefined) {
    return res.status(400).json({ message: 'Missing sensor data' });
  }

  const data = {
    timestamp: new Date().toISOString(),
    temperature,
    humidity,
    moisture
  };

  csvWriterInstance.writeRecords([data])
    .then(() => res.status(200).json({ message: 'Sensor data recorded' }))
    .catch((err) => res.status(500).json({ message: 'Failed to write data', error: err }));
};
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());


//Check if the city+state combo exists in the data
function checkCombo(req, res, next) {
  const { state, city } = req.params;
  if (!state || !city)
    return res.status(400).json({ error: 'Both "state" and "city" parameters are required' });
  const matchingData = jsonData.find(entry => (
    entry.State.toLowerCase() === state.toLowerCase() && entry.City.toLowerCase() === city.toLowerCase()
  ));

  if (!matchingData) {
    return res.status(400).json({ error: 'City and state combo not found in data' });
  }

  next();
}


// Load data from a JSON file if it exists
const dataFilePath = './data/cityPopulations.json';
if (fs.existsSync(dataFilePath)) {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  cityPopulations = JSON.parse(data);
}

// Import routes
const populationRoutes = require('./Routes/population');
app.use('/api/population', populationRoutes);

const PORT = 5555;
app.listen(PORT, () => {
  console.log(`City Population Service is running on port ${PORT}`);
});

module.exports = checkCombo
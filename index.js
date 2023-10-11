const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();
app.use(bodyParser.json());


// Import routes
// const populationRoutes = require('./Routes/population');
// app.use('/api/population', populationRoutes);

let cityPopulations = [];

// Load data from the JSON file
function readJSONFile(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    console.log("Data loaded")
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON file:', err);
    return null;
  }
}

//Load json file
const jsonFile = './data/city_populations.json';
const jsonData = readJSONFile(jsonFile);

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


// Get city population
app.get('/api/population/state/:state/city/:city?', checkCombo, (req, res) => {
  let { state, city }  = req.params
  state = state.toLowerCase()
  city = city.toLowerCase()
  
  const filteredData = jsonData.filter((entry) => entry.State.toLowerCase() === state && entry.City.toLowerCase() === city);
  res.status(200).json({population: filteredData[0].Population});

});

// Load data from a JSON file if it exists
const dataFilePath = './data/cityPopulations.json';
if (fs.existsSync(dataFilePath)) {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  cityPopulations = JSON.parse(data);
}

// Set city population
app.put('/api/population/state/:state/city/:city', (req, res) => {
  const { state, city } = req.params;
  const population = parseInt(req.body.population, 10);
  console.log(state, city, population)

  if (!population || isNaN(population)) {
    res.status(400).json({ error: 'Invalid population data' });
  } else {
    const newData = {
      City: city,
      State: state,
      Population: population,
    };

    // Check if the data already exists and update it, or create new data
    let found = false;
    for (let i = 0; i < cityPopulations.length; i++) {
      if (
        cityPopulations[i].City === city &&
        cityPopulations[i].State === state
      ) {
        cityPopulations[i] = newData;
        found = true;
        break;
      }
    }

    if (!found) {
      cityPopulations.push(newData);
    }

    // Persist the updated data to the JSON file
    fs.writeFileSync(dataFilePath, JSON.stringify(cityPopulations, null, 2));

    const status = found ? 200 : 201;
    res.status(status).json({
      message: `Population data for ${city}, ${state} has been ${
        status === 201 ? 'created' : 'updated'
      }`,
    });
  }
});

const PORT = 5555;
app.listen(PORT, () => {
  console.log(`City Population Service is running on port ${PORT}`);
});

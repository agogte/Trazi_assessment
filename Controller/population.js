const fs = require('fs');

// Load data from the JSON file
function readJSONFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        // console.log("Data loaded")
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return null;
    }
}

let cityPopulations = []

//Load json file
const jsonFile = './data/city_populations.json'
const jsonData = readJSONFile(jsonFile);

//Get method implementation
exports.getPopulation = (req, res) => {
    let { state, city } = req.params
    state = state.toLowerCase()
    city = city.toLowerCase()

    const filteredData = jsonData.filter((entry) => entry.State.toLowerCase() === state && entry.City.toLowerCase() === city);
    res.status(200).json({ population: filteredData[0].Population });

}



exports.updatePopulation = (req, res) => {
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
            message: `Population data for ${city}, ${state} has been ${status === 201 ? 'created' : 'updated'
                }`,
        });
    }
}

// Load data from a JSON file if it exists
const dataFilePath = './data/cityPopulations.json';
if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    cityPopulations = JSON.parse(data);
}
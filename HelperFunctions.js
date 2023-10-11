const fs = require('fs');

//Load json file
const jsonFile = './data/city_populations.json'
const jsonData = readJSONFile(jsonFile);

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


module.exports = {checkCombo, readJSONFile}
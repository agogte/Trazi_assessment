const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('city_populations.csv')
  .pipe(csv())
  .on('data', (data) => {
    results.push(data);
  })
  .on('end', () => {
    // All data has been parsed into results array
    // Convert the results array to a JSON string
    const json = JSON.stringify(results, null, 2);

    // Write the JSON data to a file
    fs.writeFileSync('city_populations.json', json, 'utf8');
    console.log('CSV file converted to JSON: city_populations.json');
  });

const express = require('express');
const router = express.Router();
const { checkCombo } = require('../HelperFunctions')

// Import controllers
const populationController = require('../Controller/population');

// Define routes and route handlers
router.put('/state/:state/city/:city?', populationController.updatePopulation);
router.get('/state/:state/city/:city?', checkCombo, populationController.getPopulation);

module.exports = router;

const express = require('express');
const { httGetAllPlanets } = require('./planets.controller');

const planetsRouter = express.Router();

planetsRouter.get('/planets', httGetAllPlanets);

module.exports = planetsRouter;

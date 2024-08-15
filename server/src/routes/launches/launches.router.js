const express = require('express');
const { gerAllLaunches } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/launches', gerAllLaunches);

module.exports = launchesRouter;

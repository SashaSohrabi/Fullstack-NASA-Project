const { getAllLaunches, addNewLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const newLaunch = req.body;

  newLaunch.launchDate = new Date(newLaunch.launchDate);

  addNewLaunch(newLaunch);
  return res.status(201).json(newLaunch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};

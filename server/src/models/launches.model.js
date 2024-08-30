const axios = require('axios');
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

let DEFAULT_FLIGHT_NUMBER = 100;
const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const launch = {
  flightNumber: 100, //flight_number
  mission: 'Kepler Exploration X', //name
  rocket: 'Explorer IS1', // rocket.name
  launchDate: new Date('December 27, 2030'), // date_local
  target: 'Kepler-442 b', //not applicable
  customers: ['NASA', 'Kepler Institute'], //payload.customers for each payload
  upcoming: true, //upcoming
  success: true, //success
};

saveLaunch(launch);

async function populateLaunches() {
  console.log('Loading launches data...');
  const response = await axios.post(SPACE_X_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.error('Failed to load launches data:', response.status);
    throw new Error('Launches data loading failed');
  }

  const launchesData = response.data.docs;

  for (const launchData of launchesData) {
    const payloads = launchData.payloads;
    const customers = payloads.flatMap((payload) => payload.customers);
    const launch = {
      flightNumber: launchData.flight_number,
      mission: launchData.name,
      rocket: launchData.rocket.name,
      launchDate: launchData.date_local,
      upcoming: launchData.upcoming,
      success: launchData.success,
      customers,
    };

    console.log(launch);

    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('Launches data already loaded.');
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const existingPlanet = await planets.findOne({ keplerName: launch.target });

  if (!existingPlanet) {
    throw new Error(`Planet ${launch.target} not found`);
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    upcoming: true,
    success: true,
    customers: ['NASA', 'Kepler Institute'],
  });

  saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1 && aborted.matchedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  loadLaunchesData,
};

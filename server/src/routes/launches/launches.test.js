const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });
  
  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('content-type', /json/)
        .expect(200);
      // expect(response.statusCode).toBe(200);
    });
  });
  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'Test Mission',
      rocket: 'Test Rocket',
      launchDate: 'January 1, 2034',
      target: 'Kepler-442 b',
    };

    const launchDataWithoutDate = {
      mission: 'Test Mission',
      rocket: 'Test Rocket',
      target: 'Kepler-442 b',
    };

    const launchDataWithInvalidDate = {
      mission: 'Test Mission',
      rocket: 'Test Rocket',
      launchDate: 'Invalid date',
      target: 'Kepler-442 b',
    };

    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('content-type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should respond with 400 bad request if required fields are missing', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('content-type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: 'Missing required fields' });
    });

    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('content-type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: 'Invalid launch date' });
    });
  });
});

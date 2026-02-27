const request = require('supertest');

jest.mock('../middleware/auth', () => (req, res, next) => next());
const app = require('../app');

describe('Health route', () => {
  it('GET /health should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});



const request = require('supertest');

jest.mock('../models/acupoint', () => ({
  getAcupoints: jest.fn().mockResolvedValue([{ acupunctureCode: 'LU1', acupunctureName: 'Zhong Fu' }]),
  getAcupointByCode: jest.fn().mockResolvedValue({ acupunctureCode: 'LU1', acupunctureName: 'Zhong Fu' }),
  createAcupoint: jest.fn().mockResolvedValue({ acupunctureCode: 'LU2', acupunctureName: 'Yun Men' }),
  deleteAcupoint: jest.fn().mockResolvedValue(true)
}));

const app = require('../app');

describe('Acupoint routes', () => {
  it('GET /api/acupoints should list acupoints', async () => {
    const res = await request(app).get('/api/acupoints');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/acupoints/:acupunctureCode should return one acupoint', async () => {
    const res = await request(app).get('/api/acupoints/LU1');
    expect(res.status).toBe(200);
    expect(res.body.acupunctureCode).toBe('LU1');
  });
  it('GET /api/acupoints/:acupunctureCode should return one acupoint', async () => {
    const res = await request(app).get('/api/acupoints/LU1');
    expect(res.status).toBe(200);
    expect(res.body.acupunctureCode).toBe('LU1');
  });

  it('POST /api/acupoints should create acupoint', async () => {
    const res = await request(app)
      .post('/api/acupoints')
      .send({ acupunctureName: 'Yun Men' });
    expect(res.status).toBe(201);
    expect(res.body.acupunctureName).toBe('Yun Men');
  });

  it('DELETE /api/acupoints/:acupunctureCode should delete acupoint', async () => {
    const res = await request(app).delete('/api/acupoints/LU2');
    expect(res.status).toBe(204);
  });
});
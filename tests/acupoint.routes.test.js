const request = require('supertest');

jest.mock('../models/acupoint', () => ({
  getAcupoints: jest.fn().mockResolvedValue([{ acupointCode: 'LU1', acupointName: 'Zhong Fu' }]),
  getAcupointByCode: jest.fn().mockResolvedValue({ acupointCode: 'LU1', acupointName: 'Zhong Fu' }),
  createAcupoint: jest.fn().mockResolvedValue({ acupointCode: 'LU2', acupointName: 'Yun Men' }),
  updateAcupoint: jest.fn().mockResolvedValue({ acupointCode: 'LU1', acupointName: 'Zhong Fu' }),
  deleteAcupoint: jest.fn().mockResolvedValue(true)
}));

const app = require('../app');

describe('Acupoint routes', () => {
  it('GET /api/acupoints should list acupoints', async () => {
    const res = await request(app).get('/api/acupoints');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/acupoints/:acupointCode should return one acupoint', async () => {
    const res = await request(app).get('/api/acupoints/LU1');
    expect(res.status).toBe(200);
    expect(res.body.acupointCode).toBe('LU1');
  });

  it('POST /api/acupoints should create acupoint', async () => {
    const res = await request(app)
      .post('/api/acupoints')
      .send({ acupointName: 'Yun Men' });
    expect(res.status).toBe(201);
    expect(res.body.acupointName).toBe('Yun Men');
  });

  it('PUT /api/acupoints/:acupointCode should update acupoint', async () => {
    const res = await request(app)
      .put('/api/acupoints/LU1')
      .send({ acupointName: 'Zhong Fu' });
    expect(res.status).toBe(200);
    expect(res.body.acupointName).toBe('Zhong Fu');
  });

  it('DELETE /api/acupoints/:acupointCode should delete acupoint', async () => {
    const res = await request(app).delete('/api/acupoints/LU2');
    expect(res.status).toBe(204);
  });
});
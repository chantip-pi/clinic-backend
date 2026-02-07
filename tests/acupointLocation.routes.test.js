const request = require('supertest');

jest.mock('../models/acupointLocation', () => ({
    getAcupointLocations: jest.fn().mockResolvedValue([{ locationId: 1, meridianId: 1, acupointCode: 'LU1', pointTop: 100, pointLeft: 150 }]),
    getAcupointLocationById: jest.fn().mockResolvedValue({ locationId: 1, meridianId: 1, acupointCode: 'LU1', pointTop: 100, pointLeft: 150 }),
    createAcupointLocation: jest.fn().mockResolvedValue({ locationId: 2, meridianId: 1, acupointCode: 'LU2', pointTop: 200, pointLeft: 300 }),
    updateAcupointLocation: jest.fn().mockResolvedValue({ locationId: 1, meridianId: 1, acupointCode: 'LU1', pointTop: 120, pointLeft: 170 }),
    deleteAcupointLocation: jest.fn().mockResolvedValue(true)
}));

const app = require('../app');

describe('AcupointLocation routes', () => {
    it('GET /api/acupointLocations should list acupoint locations', async () => {
        const res = await request(app).get('/api/acupointLocations');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/acupointLocations/:locationId should return one acupoint location', async () => {
        const res = await request(app).get('/api/acupointLocations/1');
        expect(res.status).toBe(200);
        expect(res.body.locationId).toBe(1);
    });

    it('POST /api/acupointLocations should create acupoint location', async () => {
        const res = await request(app)
            .post('/api/acupointLocations')
            .send({ meridianId: 1, acupointCode: 'LU2', pointTop: 200, pointLeft: 300 });
        expect(res.status).toBe(201);
        expect(res.body.acupointCode).toBe('LU2');
    });

    it('PUT /api/acupointLocations/:locationId should update acupoint location', async () => {
        const res = await request(app)
            .put('/api/acupointLocations/1')
            .send({ meridianId: 1, acupointCode: 'LU1', pointTop: 120, pointLeft: 170 });
        expect(res.status).toBe(200);
        expect(res.body.pointTop).toBe(120);
    });

    it('DELETE /api/acupointLocations/:locationId should delete acupoint location', async () => {
        const res = await request(app).delete('/api/acupointLocations/2');
        expect(res.status).toBe(204);
    });
});
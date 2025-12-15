const request = require('supertest');

jest.mock('../models/staff', () => ({
  getStaff: jest.fn().mockResolvedValue([{ staffId: 1, username: 'user1' }]),
  getStaffById: jest.fn().mockResolvedValue({ staffId: 1, username: 'user1' }),
  getStaffByUsername: jest.fn().mockResolvedValue({ staffId: 1, username: 'user1' }),
  loginStaff: jest.fn().mockResolvedValue({ staffId: 1, username: 'user1' }),
  createStaff: jest.fn().mockResolvedValue({ staffId: 2, username: 'newuser' }),
  updateStaff: jest.fn().mockResolvedValue({ staffId: 1, username: 'updated' }),
  deleteStaff: jest.fn().mockResolvedValue(true)
}));

const app = require('../app');

describe('Staff routes', () => {
  it('GET /api/staff should list staff', async () => {
    const res = await request(app).get('/api/staff');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/staff/id/:staffId should return one staff', async () => {
    const res = await request(app).get('/api/staff/id/1');
    expect(res.status).toBe(200);
    expect(res.body.staffId).toBe(1);
  });

  it('GET /api/staff/username/:username should return one staff', async () => {
    const res = await request(app).get('/api/staff/username/user1');
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('user1');
  });

  it('GET /api/staff/login/:username/:password should login staff', async () => {
    const res = await request(app).get('/api/staff/login/user1/pass');
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('user1');
  });

  it('POST /api/staff should create staff', async () => {
    const res = await request(app)
      .post('/api/staff')
      .send({ username: 'newuser', password: 'x' });
    expect(res.status).toBe(201);
    expect(res.body.username).toBe('newuser');
  });

  it('PUT /api/staff/:staffId should update staff', async () => {
    const res = await request(app)
      .put('/api/staff/1')
      .send({ username: 'updated' });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('updated');
  });

  it('DELETE /api/staff/:staffId should delete staff', async () => {
    const res = await request(app).delete('/api/staff/1');
    expect(res.status).toBe(204);
  });
});



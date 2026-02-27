const request = require('supertest');

jest.mock('../middleware/auth', () => (req, res, next) => next());

jest.mock('../models/patient', () => ({
  getPatients: jest.fn().mockResolvedValue([{ patientId: 1, nameSurname: 'John Doe' }]),
  getPatientsByAppointmentDate: jest
    .fn()
    .mockResolvedValue([{ patientId: 1, nameSurname: 'John Doe' }]),
  getPatientById: jest.fn().mockResolvedValue({ patientId: 1, nameSurname: 'John Doe' }),
  createPatient: jest.fn().mockResolvedValue({ patientId: 2, nameSurname: 'Jane Doe' }),
  updatePatient: jest.fn().mockResolvedValue({ patientId: 1, nameSurname: 'John Updated' }),
  deletePatient: jest.fn().mockResolvedValue(true),
}));

const app = require('../app');

describe('Patient routes', () => {
  it('GET /api/patients should list patients', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/patients/appointment/:appointmentDate should list patients by date', async () => {
    const res = await request(app).get('/api/patients/appointment/2025-01-01');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/patients/:patientId should return one patient', async () => {
    const res = await request(app).get('/api/patients/1');
    expect(res.status).toBe(200);
    expect(res.body.patientId).toBe(1);
  });

  it('POST /api/patients should create patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({ 
        nameSurname: 'Jane Doe',
        phoneNumber: '0123456789',
        birthday: '1990-01-01',
        gender: 'Female',
        remainingCourses: 1,
        congenitalDisease: null,
        surgeryHistory: 'Knee surgery'
      });
    expect(res.status).toBe(201);
    expect(res.body.nameSurname).toBe('Jane Doe');
  });

  it('PUT /api/patients/:patientId should update patient', async () => {
    const res = await request(app)
      .put('/api/patients/1')
      .send({ 
        nameSurname: 'John Updated',
        phoneNumber: '1234567890',
        birthday: '1990-01-01',
        gender: 'Female'
      });
    expect(res.status).toBe(200);
    expect(res.body.nameSurname).toBe('John Updated');
  });

  it('DELETE /api/patients/:patientId should delete patient', async () => {
    const res = await request(app).delete('/api/patients/1');
    expect(res.status).toBe(204);
  });
});
const request = require('supertest');

jest.mock('../models/medicalRecord', () => {
  const mockMedicalRecord = {
    recordId: 1,
    appointmentId: 123,
    patientId: 42,
    doctorId: 5,
    dateTime: "2024-01-30T14:30:00.000Z",
    diagnosis: "Acute upper respiratory infection",
    symptoms: "Fever (38.5°C), persistent cough, sore throat, fatigue",
    prescriptions: "Amoxicillin 500mg 3x daily for 7 days, Paracetamol 500mg as needed for fever",
    remarks: "Patient advised to rest and stay hydrated. Follow-up appointment in 1 week if symptoms persist.",
    createdAt: "2024-01-30T14:45:00.000Z",
    lastAmendedAt: "2024-01-30T14:45:00.000Z",
    lastAmendedBy: 99,
    currentVersion: 2,
    isLocked: false,
    assignees: [5],
    patientName: "Sarah Johnson",
    doctorName: "Dr. Michael Chen"
  };


  return {
    getMedicalRecords: jest.fn().mockResolvedValue([mockMedicalRecord]),
    getMedicalRecordById: jest.fn().mockResolvedValue(mockMedicalRecord),
    getMedicalRecordsByPatientId: jest.fn().mockResolvedValue([mockMedicalRecord]),
    createMedicalRecord: jest.fn().mockResolvedValue(mockMedicalRecord),
    updateMedicalRecord: jest.fn().mockResolvedValue({ ...mockMedicalRecord, diagnosis: 'Updated diagnosis' }),
  };
});

jest.mock('../models/appointment', () => ({
  getAppointmentById: jest.fn().mockResolvedValue({
    appointmentId: 1,
    patientId: 1,
    doctorId: 2,
    appointmentDateTime: '2025-01-01T10:00:00Z',
    status: 'scheduled',
    reason: null
  }),
  updateAppointment: jest.fn().mockResolvedValue({ appointmentId: 1 })
}));

const app = require('../app');

describe('MedicalRecord routes', () => {
  it('GET /api/medicalRecords should list medical records', async () => {
    const res = await request(app).get('/api/medicalRecords');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/medicalRecords/:medicalRecordId should return one record', async () => {
    const res = await request(app).get('/api/medicalRecords/1');
    expect(res.status).toBe(200);
    expect(res.body.recordId).toBe(1);
  });

  it('GET /api/medicalRecords/patient/:patientId should return records for patient', async () => {
    const res = await request(app).get('/api/medicalRecords/patient/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/medicalRecords should create a record and update appointment', async () => {
    const res = await request(app)
      .post('/api/medicalRecords')
      .send({
        appointmentId: 123,
        patientId: 42,
        doctorId: 5,
        dateTime: "2024-01-30T14:30:00.000Z",
        diagnosis: "Acute upper respiratory infection",
        symptoms: "Fever (38.5°C), persistent cough, sore throat, fatigue",
        prescriptions: "Amoxicillin 500mg 3x daily for 7 days, Paracetamol 500mg as needed for fever",
        remarks: "Patient advised to rest and stay hydrated. Follow-up appointment in 1 week if symptoms persist.",
        assignees: [5]
      });

    expect(res.status).toBe(201);
    expect(res.body.recordId).toBe(1);
  });

  it('PUT /api/medicalRecords/update/:medicalRecordId should update record', async () => {
    const res = await request(app)
      .put('/api/medicalRecords/update/1')
      .send({ diagnosis: 'Updated diagnosis' });
    expect(res.status).toBe(200);
    expect(res.body.diagnosis).toBe('Updated diagnosis');
  });

});

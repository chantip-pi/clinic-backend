const request = require("supertest");

jest.mock("../models/medicalRecordIllness", () => ({
  getMedicalRecordIllnesses: jest.fn().mockResolvedValue([
    { recordId: 1, illnessId: 1 },
    { recordId: 1, illnessId: 2 },
  ]),
  getIllnessesByRecordId: jest.fn().mockResolvedValue([
    { recordId: 1, illnessId: 1 },
    { recordId: 1, illnessId: 2 },
  ]),
  createMedicalRecordIllness: jest
    .fn()
    .mockResolvedValue({ recordId: 1, illnessId: 3 }),
  deleteMedicalRecordIllness: jest.fn().mockResolvedValue(true),
  deleteAllIllnessesForRecord: jest.fn().mockResolvedValue(true),
}));

const app = require("../app");

describe("Medical Record Illness routes", () => {
  it("GET /api/medicalRecordIllnesses should list medical record illnesses", async () => {
    const res = await request(app).get("/api/medicalRecordIllnesses");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/medicalRecordIllnesses/:recordId should return illnesses by record ID", async () => {
    const res = await request(app).get("/api/medicalRecordIllnesses/1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/medicalRecordIllnesses/:recordId should create medical record illness", async () => {
    const res = await request(app)
      .post("/api/medicalRecordIllnesses/1")
      .send({ illnessId: 3 });
    expect(res.status).toBe(201);
    expect(res.body.illnessId).toBe(3);
  });

  it("DELETE /api/medicalRecordIllnesses/:recordId/:illnessId should delete medical record illness", async () => {
    const res = await request(app).delete("/api/medicalRecordIllnesses/1/3");
    expect(res.status).toBe(204);
  });

  it("DELETE /api/medicalRecordIllnesses/:recordId should delete all illnesses for a record", async () => {
    const res = await request(app).delete("/api/medicalRecordIllnesses/1");
    expect(res.status).toBe(204);
  });
});

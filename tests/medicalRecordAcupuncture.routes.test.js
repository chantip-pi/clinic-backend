const request = require("supertest");

jest.mock("../models/medicalRecordAcupuncture", () => ({
  getMedicalRecordAcupunctures: jest.fn().mockResolvedValue([
    { recordId: 1, acupunctureId: 1 },
    { recordId: 1, acupunctureId: 2 },
  ]),
  getAcupuncturesByRecordId: jest.fn().mockResolvedValue([
    { recordId: 1, acupunctureId: 1 },
    { recordId: 1, acupunctureId: 2 },
  ]),
  createMedicalRecordAcupuncture: jest
    .fn()
    .mockResolvedValue({ recordId: 1, acupunctureId: 3 }),
  deleteMedicalRecordAcupuncture: jest.fn().mockResolvedValue(true),
  deleteAllAcupuncturesForRecord: jest.fn().mockResolvedValue(true),
}));

const app = require("../app");

describe("Medical Record Acupuncture routes", () => {
  it("GET /api/medicalRecordAcupunctures should list medical record acupunctures", async () => {
    const res = await request(app).get("/api/medicalRecordAcupunctures");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/medicalRecordAcupunctures/:recordId should return acupunctures by record ID", async () => {
    const res = await request(app).get("/api/medicalRecordAcupunctures/1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/medicalRecordAcupunctures/:recordId should create medical record acupuncture", async () => {
    const res = await request(app)
      .post("/api/medicalRecordAcupunctures/1")
      .send({ acupunctureId: 3 });
    expect(res.status).toBe(201);
    expect(res.body.acupunctureId).toBe(3);
  });

  it("DELETE /api/medicalRecordAcupunctures/:recordId/:acupunctureId should delete medical record acupuncture", async () => {
    const res = await request(app).delete("/api/medicalRecordAcupunctures/1/3");
    expect(res.status).toBe(204);
  });

  it("DELETE /api/medicalRecordAcupunctures/:recordId should delete all acupunctures for a record", async () => {
    const res = await request(app).delete("/api/medicalRecordAcupunctures/1");
    expect(res.status).toBe(204);
  });
});

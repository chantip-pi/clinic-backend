const request = require('supertest');

jest.mock('../models/illness', () => ({
    getIllnesses: jest.fn().mockResolvedValue([{ illnessId: 1, illnessName: 'Flu', description: 'Influenza', category: 'Viral' }]),
    getIllnessById: jest.fn().mockResolvedValue({ illnessId: 1, illnessName: 'Flu', description: 'Influenza', category: 'Viral' }),
    createIllness: jest.fn().mockResolvedValue({ illnessId: 2, illnessName: 'Cold', description: 'Common Cold', category: 'Viral' }),
    updateIllness: jest.fn().mockResolvedValue({ illnessId: 1, illnessName: 'Flu', description: 'Influenza Updated', category: 'Viral' }),
    deleteIllness: jest.fn().mockResolvedValue(true)
}));

const app = require("../app");

describe("Illness routes", () => {
  it("GET /api/illnesses should list illnesses", async () => {
    const res = await request(app).get("/api/illnesses");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/illnesses/:illnessId should return one illness", async () => {
    const res = await request(app).get("/api/illnesses/1");
    expect(res.status).toBe(200);
    expect(res.body.illnessId).toBe(1);
  });

  it("POST /api/illnesses should create illness", async () => {
    const res = await request(app)
      .post("/api/illnesses")
      .send({
        illnessName: "Cold",
        description: "Common Cold",
        category: "Viral",
      });
    expect(res.status).toBe(201);
    expect(res.body.illnessName).toBe("Cold");
  });

  it("PUT /api/illnesses/:illnessId should update illness", async () => {
    const res = await request(app)
      .put("/api/illnesses/1")
      .send({
        illnessName: "Flu",
        description: "Influenza Updated",
        category: "Viral",
      });
    expect(res.status).toBe(200);
    expect(res.body.description).toBe("Influenza Updated");
  });

  it("DELETE /api/illnesses/:illnessId should delete illness", async () => {
    const res = await request(app).delete("/api/illnesses/2");
    expect(res.status).toBe(204);
  });
});
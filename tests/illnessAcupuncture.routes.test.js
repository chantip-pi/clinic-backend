const request = require("supertest");

jest.mock("../models/illnessAcupuncture", () => ({
  getIllnessAcupunctures: jest.fn().mockResolvedValue([{ illnessId: 1, acupunctureId: 1 }]),
  getAcupuncturesByIllnessId: jest.fn().mockResolvedValue([{ illnessId: 1, acupunctureId: 1 }]),
  createIllnessAcupuncture: jest.fn().mockResolvedValue({ illnessId: 1, acupunctureId: 2 }),
  deleteIllnessAcupuncture: jest.fn().mockResolvedValue(true),
  deleteAllAcupuncturesByIllnessId: jest.fn().mockResolvedValue(true),
}));

const app = require("../app");

describe("Illness Acupuncture routes", () => {
  it("GET /api/illnessAcupunctures should list illness acupunctures", async () => {
    const res = await request(app).get("/api/illnessAcupunctures");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/illnessAcupunctures/:illnessId should return acupunctures by illness ID", async () => {
    const res = await request(app).get("/api/illnessAcupunctures/1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/illnessAcupunctures should create illness acupuncture", async () => {
    const res = await request(app)
      .post("/api/illnessAcupunctures")
      .send({ illnessId: 1, acupunctureId: 2 });
    expect(res.status).toBe(201);
    expect(res.body.acupunctureId).toBe(2);
  });

  it("DELETE /api/illnessAcupunctures/:illnessId/:acupunctureId should delete illness acupuncture", async () => {
    const res = await request(app).delete("/api/illnessAcupunctures/1/2");
    expect(res.status).toBe(204);
  });

  it("DELETE /api/illnessAcupunctures/:illnessId should delete all acupunctures for an illness", async () => {
    const res = await request(app).delete("/api/illnessAcupunctures/1");
    expect(res.status).toBe(204);
  });
});

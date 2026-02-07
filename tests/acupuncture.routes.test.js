const request = require("supertest");

jest.mock("../models/acupuncture", () => ({
  getAcupunctures: jest.fn().mockResolvedValue([{ acupunctureId: 1, acupunctureCode: "LU1", meridianId: 1 },]),
  getAcupunctureById: jest.fn().mockResolvedValue({ acupunctureId: 1,acupunctureCode: "LU1",meridianId: 1,}),
  getAcupuncturesByMeridianId: jest.fn().mockResolvedValue([{ acupunctureId: 1, acupunctureCode: "LU1", meridianId: 1 },]),
  getAcupuncturesByRegionAndSide: jest.fn().mockResolvedValue([{ acupunctureId: 1, acupunctureCode: "LU1", meridianId: 1 },]),
  createAcupuncture: jest.fn().mockResolvedValue({acupunctureId: 2,acupunctureCode: "LU2",meridianId: 1,}),
  updateAcupuncture: jest.fn().mockResolvedValue({acupunctureId: 1,acupunctureCode: "LU1",meridianId: 1,}),
  deleteAcupuncture: jest.fn().mockResolvedValue(true),
}));

const app = require("../app");

describe("Acupuncture routes", () => {
  it("GET /api/acupunctures should list acupunctures", async () => {
    const res = await request(app).get("/api/acupunctures");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/acupunctures/:acupunctureId should return one acupuncture", async () => {
    const res = await request(app).get("/api/acupunctures/1");
    expect(res.status).toBe(200);
    expect(res.body.acupunctureId).toBe(1);
  });

  it("GET /api/acupunctures/meridian/:meridianId should return acupunctures by meridian", async () => {
    const res = await request(app).get("/api/acupunctures/meridian/1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/acupunctures/region/:region/side/:side should return acupunctures by region and side", async () => {
    const res = await request(app).get("/api/acupunctures/region/arm/side/left");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/acupunctures should create acupuncture", async () => {
    const res = await request(app)
      .post("/api/acupunctures")
      .send({ acupunctureCode: "LU2", meridianId: 1 });
    expect(res.status).toBe(201);
    expect(res.body.acupunctureCode).toBe("LU2");
  });

  it("PUT /api/acupunctures/:acupunctureId should update acupuncture", async () => {
    const res = await request(app)
      .put("/api/acupunctures/1")
      .send({ acupunctureCode: "LU1", meridianId: 1 });
    expect(res.status).toBe(200);
    expect(res.body.acupunctureCode).toBe("LU1");
  });

  it("DELETE /api/acupunctures/:acupunctureId should delete acupuncture", async () => {
    const res = await request(app).delete("/api/acupunctures/2");
    expect(res.status).toBe(204);
  });
});

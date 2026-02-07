const request = require('supertest');

jest.mock('../models/meridian', () => ({
    getMeridians: jest.fn().mockResolvedValue([{ meridianId: 1, meridianName: 'Lung', region: 'Head', side: 'Left', image: 'lung.png' }]),
    getMeridianById: jest.fn().mockResolvedValue({ meridianId: 1, meridianName: 'Lung', region: 'Head', side: 'Left', image: 'lung.png' }),
    getMeridianRegion: jest.fn().mockResolvedValue([{ meridianId: 1, meridianName: 'Lung', region: 'Head', side: 'Left', image: 'lung.png' }]),
    getMeridianSidesByRegion: jest.fn().mockResolvedValue([{ meridianId: 1, meridianName: 'Lung', region: 'Head', side: 'Left', image: 'lung.png' }]),
    createMeridian: jest.fn().mockResolvedValue({ meridianId: 2, meridianName: 'Large Intestine', region: 'Head', side: 'Right', image: 'large_intestine.png' }),
    updateMeridian: jest.fn().mockResolvedValue({ meridianId: 1, meridianName: 'Lung Updated', region: 'Head', side: 'Left', image: 'lung_updated.png' }),
    deleteMeridian: jest.fn().mockResolvedValue(true)
}));

const app = require('../app');

describe("Meridian routes", () => {
  it("GET /api/meridians should list meridians", async () => {
    const res = await request(app).get("/api/meridians");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/meridians/:meridianId should return one meridian", async () => {
    const res = await request(app).get("/api/meridians/meridian/1");
    expect(res.status).toBe(200);
    expect(res.body.meridianId).toBe(1);
  });

  it("GET /api/meridians/regions should list all regions in meridian", async () => {
    const res = await request(app).get("/api/meridians/regions");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/meridians/regions/:regions should return all sides for the region", async () => {
    const res = await request(app).get("/api/meridians/regions/{head}");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/meridians should create meridian", async () => {
    const res = await request(app)
      .post("/api/meridians")
      .send({
        meridianName: "Large Intestine",
        region: "Upper",
        side: "Right",
        image: "large_intestine.png",
      });
    expect(res.status).toBe(201);
    expect(res.body.meridianName).toBe("Large Intestine");
  });

  it("PUT /api/meridians/meridian/:meridianId should update meridian", async () => {
    const res = await request(app)
      .put("/api/meridians/meridian/1")
      .send({
        meridianName: "Lung Updated",
        region: "Upper",
        side: "Left",
        image: "lung_updated.png",
      });
    expect(res.status).toBe(200);
    expect(res.body.meridianName).toBe("Lung Updated");
  });

  it("DELETE /api/meridians/meridian/:meridianId should delete meridian", async () => {
    const res = await request(app).delete("/api/meridians/meridian/2");
    expect(res.status).toBe(204);
  });
});
const request = require('supertest');
const app = require('../app');
const path = require('path');
const fs = require('fs');

const cleanupGeneratedImages = () => {
  const imagesDir = path.join(__dirname, '../images');
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    files.forEach(file => {
      // Remove files that match the generated pattern (timestamp-randomnumber.extension)
      if (/^\d+-\d+\./.test(file)) {
        fs.unlinkSync(path.join(imagesDir, file));
      }
    });
  }
};

describe('Images routes', () => {
  const testImagePath = path.join(__dirname, '../images/test-image.jpg');

  beforeAll(() => {
    // Clean up any leftover generated images from previous test runs
    cleanupGeneratedImages();
    
    // Create a test image file if it doesn't exist
    if (!fs.existsSync(testImagePath)) {
      fs.writeFileSync(testImagePath, 'fake image content');
    }
  });

  afterAll(() => {
    // Clean up test image
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    
    // Clean up any generated images
    cleanupGeneratedImages();
  });

  describe('GET /api/images', () => {
    it('should return list of images', async () => {
      const res = await request(app).get('/api/images');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('images');
      expect(Array.isArray(res.body.images)).toBe(true);
    });
  });

  describe('GET /api/images/:filename', () => {
    it('should return image file if exists', async () => {
      const res = await request(app).get('/api/images/test-image.jpg');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/^image\//);
    });

    it('should return 404 if image does not exist', async () => {
      const res = await request(app).get('/api/images/nonexistent.jpg');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Image not found');
    });
  });

  describe('POST /api/images', () => {
    it('should upload an image successfully', async () => {
      const res = await request(app)
        .post('/api/images')
        .attach('image', Buffer.from('fake image data'), 'test.jpg');
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Image uploaded successfully');
      expect(res.body).toHaveProperty('filename');
    });

    it('should return 400 if no file provided', async () => {
      const res = await request(app).post('/api/images');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'No image file provided');
    });
  });

  describe('DELETE /api/images/:filename', () => {
    it('should delete image if exists', async () => {
      // First upload a test image
      const uploadRes = await request(app)
        .post('/api/images')
        .attach('image', Buffer.from('fake image data'), 'delete-test.jpg');
      expect(uploadRes.status).toBe(201);
      const filename = uploadRes.body.filename;

      // Then delete it
      const deleteRes = await request(app).delete(`/api/images/${filename}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toHaveProperty('message', 'Image deleted successfully');
    });

    it('should return 404 if image does not exist', async () => {
      const res = await request(app).delete('/api/images/nonexistent.jpg');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Image not found');
    });
  });
});
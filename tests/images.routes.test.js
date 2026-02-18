const request = require('supertest');
const express = require('express');
const imageRouter = require('../routes/images');

// Mock cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    api: {
      resources: jest.fn(),
    },
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
    url: jest.fn(),
  },
}));

// Mock streamifier
jest.mock('streamifier', () => ({
  createReadStream: jest.fn(() => ({
    pipe: jest.fn(),
  })),
}));

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const app = express();
app.use(express.json());
app.use('/api', imageRouter);

describe('Image Router (Cloudinary)', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    // ✅ Suppress console.error output and spy on it instead
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // ─────────────────────────────────────────────
  // GET /api/images
  // ─────────────────────────────────────────────
  describe('GET /api/images', () => {
    it('should return list of image filenames from Cloudinary', async () => {
      cloudinary.api.resources.mockResolvedValue({
        resources: [
          { public_id: 'images/headFront', format: 'png' },
          { public_id: 'images/headLeft',  format: 'png' },
          { public_id: 'images/body',      format: 'jpg' },
        ],
      });

      const res = await request(app).get('/api/images');

      expect(res.status).toBe(200);
      expect(res.body.images).toEqual(['headFront.png', 'headLeft.png', 'body.jpg']);
      expect(cloudinary.api.resources).toHaveBeenCalledWith({
        type: 'upload',
        prefix: 'images/',
        max_results: 100,
      });
    });

    it('should return empty array when no images exist', async () => {
      cloudinary.api.resources.mockResolvedValue({ resources: [] });

      const res = await request(app).get('/api/images');

      expect(res.status).toBe(200);
      expect(res.body.images).toEqual([]);
    });

    it('should return 500 and log error when Cloudinary API fails', async () => {
      cloudinary.api.resources.mockRejectedValue(new Error('Cloudinary error'));

      const res = await request(app).get('/api/images');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Unable to list images');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Cloudinary list error:',
        expect.any(Error)
      );
    });
  });

  // ─────────────────────────────────────────────
  // GET /api/images/:filename
  // ─────────────────────────────────────────────
  describe('GET /api/images/:filename', () => {
    it('should redirect to the Cloudinary CDN URL', async () => {
      cloudinary.url.mockReturnValue(
        'https://res.cloudinary.com/dartagudr/image/upload/images/headFront.png'
      );

      const res = await request(app).get('/api/images/headFront.png');

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe(
        'https://res.cloudinary.com/dartagudr/image/upload/images/headFront.png'
      );
      expect(cloudinary.url).toHaveBeenCalledWith('images/headFront', { secure: true });
    });

    it('should strip extension correctly when building public_id', async () => {
      cloudinary.url.mockReturnValue('https://res.cloudinary.com/dartagudr/image/upload/images/body.jpg');

      await request(app).get('/api/images/body.jpg');

      expect(cloudinary.url).toHaveBeenCalledWith('images/body', { secure: true });
    });
  });

  // ─────────────────────────────────────────────
  // POST /api/images
  // ─────────────────────────────────────────────
  describe('POST /api/images', () => {
    const mockUploadStream = (result) => {
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        setImmediate(() => callback(null, result));
        return { on: jest.fn() };
      });
      streamifier.createReadStream.mockReturnValue({ pipe: jest.fn() });
    };

    const mockUploadStreamError = (message) => {
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        setImmediate(() => callback(new Error(message), null));
        return { on: jest.fn() };
      });
      streamifier.createReadStream.mockReturnValue({ pipe: jest.fn() });
    };

    it('should upload image and return original filename', async () => {
      mockUploadStream({
        public_id: 'images/headFront',
        format: 'png',
        secure_url: 'https://res.cloudinary.com/dartagudr/image/upload/images/headFront.png',
      });

      const res = await request(app)
        .post('/api/images')
        .attach('image', Buffer.from('fake-image-data'), 'headFront.png');

      expect(res.status).toBe(201);
      expect(res.body.filename).toBe('headFront.png');
      expect(res.body.message).toBe('Image uploaded successfully');
      expect(res.body.url).toContain('headFront');
    });

    it('should call Cloudinary with correct options to preserve filename', async () => {
      mockUploadStream({
        public_id: 'images/headFront',
        format: 'png',
        secure_url: 'https://res.cloudinary.com/dartagudr/image/upload/images/headFront.png',
      });

      await request(app)
        .post('/api/images')
        .attach('image', Buffer.from('fake-image-data'), 'headFront.png');

      const [options] = cloudinary.uploader.upload_stream.mock.calls[0];
      expect(options.folder).toBe('images');
      expect(options.public_id).toBe('headFront');
      expect(options.unique_filename).toBe(false);
    });

    it('should return 400 when no file is provided', async () => {
      const res = await request(app).post('/api/images');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('No image file provided');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });


    it('should return 500 and log error when Cloudinary upload fails', async () => {
      mockUploadStreamError('Upload failed');

      const res = await request(app)
        .post('/api/images')
        .attach('image', Buffer.from('fake-image-data'), 'headFront.png');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to upload image');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Cloudinary upload error:',
        expect.any(Error)
      );
    });
  });

  // ─────────────────────────────────────────────
  // PUT /api/images/:filename
  // ─────────────────────────────────────────────
  describe('PUT /api/images/:filename', () => {
    const mockReplaceStream = (result) => {
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        setImmediate(() => callback(null, result));
        return { on: jest.fn() };
      });
      streamifier.createReadStream.mockReturnValue({ pipe: jest.fn() });
    };

    const mockReplaceStreamError = (message) => {
      cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        setImmediate(() => callback(new Error(message), null));
        return { on: jest.fn() };
      });
      streamifier.createReadStream.mockReturnValue({ pipe: jest.fn() });
    };

    it('should replace existing image and return filename', async () => {
      mockReplaceStream({
        public_id: 'images/headFront',
        format: 'png',
        secure_url: 'https://res.cloudinary.com/dartagudr/image/upload/images/headFront.png',
      });

      const res = await request(app)
        .put('/api/images/headFront.png')
        .attach('image', Buffer.from('new-image-data'), 'headFront.png');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Image updated successfully');
      expect(res.body.filename).toBe('headFront.png');
    });

    it('should call Cloudinary with overwrite: true and correct public_id', async () => {
      mockReplaceStream({
        public_id: 'images/headFront',
        format: 'png',
        secure_url: 'https://res.cloudinary.com/dartagudr/image/upload/images/headFront.png',
      });

      await request(app)
        .put('/api/images/headFront.png')
        .attach('image', Buffer.from('new-image-data'), 'headFront.png');

      const [options] = cloudinary.uploader.upload_stream.mock.calls[0];
      expect(options.overwrite).toBe(true);
      expect(options.public_id).toBe('images/headFront');
    });

    it('should return 400 when no file is provided', async () => {
      const res = await request(app).put('/api/images/headFront.png');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('No image file provided');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should return 500 and log error when Cloudinary replace fails', async () => {
      mockReplaceStreamError('Replace failed');

      const res = await request(app)
        .put('/api/images/headFront.png')
        .attach('image', Buffer.from('new-image-data'), 'headFront.png');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to replace image');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Cloudinary replace error:',
        expect.any(Error)
      );
    });
  });

  // ─────────────────────────────────────────────
  // DELETE /api/images/:filename
  // ─────────────────────────────────────────────
  describe('DELETE /api/images/:filename', () => {
    it('should delete image successfully', async () => {
      cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });

      const res = await request(app).delete('/api/images/headFront.png');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Image deleted successfully');
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('images/headFront');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should return 404 when image does not exist on Cloudinary', async () => {
      cloudinary.uploader.destroy.mockResolvedValue({ result: 'not found' });

      const res = await request(app).delete('/api/images/ghost.png');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Image not found');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should return 500 and log error when Cloudinary destroy throws', async () => {
      cloudinary.uploader.destroy.mockRejectedValue(new Error('Destroy failed'));

      const res = await request(app).delete('/api/images/headFront.png');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Unable to delete image');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Cloudinary delete error:',
        expect.any(Error)
      );
    });

    it('should strip extension correctly when building public_id for deletion', async () => {
      cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });

      await request(app).delete('/api/images/body.jpg');

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('images/body');
    });
  });
});
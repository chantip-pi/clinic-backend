const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const path = require('path');

const router = express.Router();

// Cloudinary is auto-configured from CLOUDINARY_URL env variable

// Use memory storage — no disk writing
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper: upload buffer to Cloudinary using the original filename as public_id
const uploadToCloudinary = (buffer, originalname) => {
  // Strip extension — Cloudinary stores public_id without extension
  const nameWithoutExt = path.basename(originalname, path.extname(originalname));

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'images',
        public_id: nameWithoutExt,   // ✅ preserve original filename
        overwrite: false,            // don't silently overwrite existing files
        use_filename: true,
        unique_filename: false,      // ✅ don't append random suffix
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// GET /api/images - List all images from Cloudinary
router.get('/images', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'images/',
      max_results: 100,
    });

    const images = result.resources.map((r) => {
      const parts = r.public_id.split('/');
      const name = parts[parts.length - 1];
      return `${name}.${r.format}`;
    });

    res.json({ images });
  } catch (err) {
    console.error('Cloudinary list error:', err);
    res.status(500).json({ error: 'Unable to list images' });
  }
});

// GET /api/images/:filename - Redirect to Cloudinary URL
router.get('/images/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const publicId = `images/${filename.replace(/\.[^/.]+$/, '')}`;
    const url = cloudinary.url(publicId, { secure: true });
    res.redirect(url);
  } catch (err) {
    console.error('Cloudinary get error:', err);
    res.status(404).json({ error: 'Image not found' });
  }
});

// POST /api/images - Upload new image to Cloudinary
router.post('/images', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    // Reconstruct filename with extension from Cloudinary result
    const parts = result.public_id.split('/');
    const name = parts[parts.length - 1];
    const filename = `${name}.${result.format}`;

    res.status(201).json({
      message: 'Image uploaded successfully',
      filename,                          // e.g. "headFront.png"
      originalName: req.file.originalname,
      url: result.secure_url,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// PUT /api/images/:filename - Replace existing image on Cloudinary
router.put('/images/:filename', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  try {
    const filename = req.params.filename;
    const publicId = `images/${filename.replace(/\.[^/.]+$/, '')}`;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          overwrite: true,           // ✅ explicitly replace
          unique_filename: false,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    res.json({
      message: 'Image updated successfully',
      filename,
      url: result.secure_url,
    });
  } catch (err) {
    console.error('Cloudinary replace error:', err);
    res.status(500).json({ error: 'Failed to replace image' });
  }
});

// DELETE /api/images/:filename - Delete image from Cloudinary
router.delete('/images/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const publicId = `images/${filename.replace(/\.[^/.]+$/, '')}`;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'not found') {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    res.status(500).json({ error: 'Unable to delete image' });
  }
});

module.exports = router;
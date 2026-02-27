const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const path = require('path');
const fileType = require('file-type');
const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Cloudinary is auto-configured from CLOUDINARY_URL env variable

// Allowed file types and their magic numbers
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Enhanced file validation function
const validateFileContent = async (buffer, mimetype) => {
  try {
    // Verify file type using magic numbers
    const typeInfo = await fileType.fromBuffer(buffer);
    
    if (!typeInfo) {
      throw new Error('Invalid file format');
    }
    
    // Check if detected MIME type matches allowed types
    if (!ALLOWED_MIME_TYPES.includes(typeInfo.mime)) {
      throw new Error(`File type ${typeInfo.mime} not allowed`);
    }
    
    // Check if declared MIME type matches detected type
    if (mimetype !== typeInfo.mime) {
      throw new Error('File MIME type mismatch');
    }
    
    return true;
  } catch (error) {
    throw new Error(`File validation failed: ${error.message}`);
  }
};

// Sanitize filename
const sanitizeFilename = (filename) => {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
    // Remove special characters, keep alphanumeric, dash, underscore
  const sanitizedName = name.replace(/[^a-zA-Z0-9\-_]/g, '_');
  return `${sanitizedName}${ext}`;
};

// Use memory storage — no disk writing
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Basic MIME type check first
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE
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
router.post('/images', uploadLimiter, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  try {
    // Additional content validation
    await validateFileContent(req.file.buffer, req.file.mimetype);
    
    // Sanitize filename
    const sanitizedName = sanitizeFilename(req.file.originalname);
    const result = await uploadToCloudinary(req.file.buffer, sanitizedName);

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
router.put('/images/:filename', uploadLimiter, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  try {
    // Additional content validation
    await validateFileContent(req.file.buffer, req.file.mimetype);
    
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
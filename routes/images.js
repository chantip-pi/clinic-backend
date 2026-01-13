const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// GET /api/images - List all images
router.get('/images', (req, res) => {
  const imagesDir = path.join(__dirname, '../images');

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read images directory' });
    }

    // Filter only image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
    });

    res.json({ images: imageFiles });
  });
});

// GET /api/images/:filename - Get specific image
router.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../images', filename);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// POST /api/images - Upload new image
router.post('/images', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  res.status(201).json({
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    originalName: req.file.originalname
  });
});

// PUT /api/images/:filename - Replace existing image
router.put('/images/:filename', upload.single('image'), (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../images', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Delete old file
  fs.unlinkSync(filePath);

  // Rename new file to old filename
  const newFilePath = path.join(__dirname, '../images', filename);
  fs.renameSync(req.file.path, newFilePath);

  res.json({
    message: 'Image updated successfully',
    filename: filename
  });
});

// DELETE /api/images/:filename - Delete image
router.delete('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../images', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Delete file
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to delete image' });
    }

    res.json({ message: 'Image deleted successfully' });
  });
});

module.exports = router;
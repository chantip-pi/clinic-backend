const express = require('express');
const multer = require('multer');
const { execute } = require('../gemini/suggestion.service');
const { getIllnesses } = require('../models/illness');
const { getMeridians, getUniqueMeridianNames } = require('../models/meridian');

const auth = require("../middleware/auth");
const { geminiValidation } = require('../middleware/validation');
const { aiLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

// Configure multer for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 7 * 1024 * 1024, // 7MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common image file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
    }
  }
});

router.post('/suggest', aiLimiter, auth, upload.single('image'), geminiValidation.suggest, async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    
    // Validate that either symptoms or image is provided
    if (!symptoms && !req.file) {
      return res.status(400).json({ 
        error: 'Either symptoms text or an image must be provided' 
      });
    }
    
    // Prepare image data if uploaded
    let imageData = null;
    if (req.file) {
      imageData = {
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname
      };
    }
    
    // Fetch database context
    const illnesses = await getIllnesses();
    const meridians = await getMeridians();
    const meridianNames = await getUniqueMeridianNames();
    
    const text = await execute(symptoms || '', { illnesses, meridians, meridianNames }, imageData);
    res.json({ result: text });
  } catch (err) {
    next(err);
  }
});


module.exports = router;



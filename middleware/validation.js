const { body, param, query, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Common validation patterns
const commonValidations = {
  id: param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  staffId: param('staffId').isInt({ min: 1 }).withMessage('Staff ID must be a positive integer'),
  patientId: param('patientId').isInt({ min: 1 }).withMessage('Patient ID must be a positive integer'),
  appointmentId: param('appointmentId').isInt({ min: 1 }).withMessage('Appointment ID must be a positive integer'),
  medicalRecordId: param('medicalRecordId').isInt({ min: 1 }).withMessage('Medical record ID must be a positive integer'),
  username: body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  email: body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  name: body('nameSurname').isLength({ min: 2, max: 100 }).trim().escape().withMessage('Name must be 2-100 characters'),
  password: body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  gender: body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  title: body('title').isIn(['Doctor', 'Staff', 'Manager']).withMessage('Title must be Doctor, Staff or Manager')
};

// Staff validation schemas
const staffValidation = {
  create: [
    commonValidations.username,
    commonValidations.password,
    commonValidations.name,
    commonValidations.email,
    body('birthday').isISO8601().toDate().withMessage('Valid birthday date required'),
    commonValidations.gender,
    commonValidations.title,
    handleValidationErrors
  ],
  update: [
    commonValidations.staffId,
    body('username').optional({ nullable: true }).isLength({ min: 3, max: 50 }),
    body('password').optional({ nullable: true }).isLength({ min: 6 }),
    body('nameSurname').optional({ nullable: true }).isLength({ min: 2, max: 100 }).trim().escape(),
    body('email').optional({ nullable: true }).isEmail().normalizeEmail(),
    body('birthday').optional({ nullable: true }).isISO8601().toDate(),
    body('gender').optional({ nullable: true }).isIn(['Male', 'Female']),
    body('title').optional({ nullable: true }).isIn(['Doctor', 'Staff', 'Manager']),
    handleValidationErrors
  ],
  login: [
    body('username').isLength({ min: 3, max: 50 }),
    body('password').isLength({ min: 1 }).withMessage('Password is required'),
    handleValidationErrors
  ]
};

// Patient validation schemas
const patientValidation = {
  create: [
    body('nameSurname').isLength({ min: 2, max: 100 }).trim().escape(),
    body('phoneNumber').isLength({ min: 8, max: 20 }).withMessage('Phone number must be 8-20 characters'),
    body('birthday').isISO8601().toDate(),
    body('gender').isIn(['Male', 'Female']),
    body('remainingCourse').optional({ nullable: true }).isInt({ min: 0 }).withMessage('Remaining course must be a non-negative integer'),
    body('congenitalDisease').optional({ nullable: true }).isLength({ max: 2000 }).trim().escape(),
    body('surgeryHistory').optional({ nullable: true }).isLength({ max: 2000 }).trim().escape(),
    handleValidationErrors
  ],
  update: [
    commonValidations.patientId,
    body('nameSurname').optional({ nullable: true }).isLength({ min: 2, max: 100 }).trim().escape(),
    body('phoneNumber').optional({ nullable: true }).isLength({ min: 8, max: 20 }).withMessage('Phone number must be 8-20 characters'),
    body('birthday').optional({ nullable: true }).isISO8601().toDate(),
    body('gender').optional({ nullable: true }).isIn(['Male', 'Female']),
    body('remainingCourse').optional({ nullable: true }).isInt({ min: 0 }).withMessage('Remaining course must be a non-negative integer'),
    body('congenitalDisease').optional({ nullable: true }).isLength({ max: 2000 }).trim().escape(),
    body('surgeryHistory').optional({ nullable: true }).isLength({ max: 2000 }).trim().escape(),
    handleValidationErrors
  ]
};

// Appointment validation schemas
const appointmentValidation = {
  create: [
    body('patientId').isInt({ min: 1 }),
    body('doctorId').isInt({ min: 1 }),
    body('appointmentDateTime').isISO8601().toDate(),
    body('status').isIn(['scheduled', 'completed', 'canceled', 'Scheduled', 'Completed', 'Canceled']),
    body('reason').optional({ nullable: true }).isLength({ max: 2000 }).trim().escape(),
    handleValidationErrors
  ],
  update: [
    commonValidations.appointmentId,
    body('patientId').optional({ nullable: true }).isInt({ min: 1 }),
    body('doctorId').optional({ nullable: true }).isInt({ min: 1 }),
    body('appointmentDateTime').optional({ nullable: true }).isISO8601().toDate(),
    body('status').optional({ nullable: true }).isIn(['scheduled', 'completed', 'canceled', 'Scheduled', 'Completed', 'Canceled', 'Scheduled', 'Completed', 'Canceled']),
    body('reason').optional({ nullable: true }).isLength({ max: 2000 }).trim().escape(),
    handleValidationErrors
  ]
};

// Medical record validation schemas
const medicalRecordValidation = {
  create: [
    body('patientId').isInt({ min: 1 }).withMessage('Patient ID must be a positive integer'),
    body('appointmentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Appointment ID must be a positive integer'),
    body('diagnosis').isLength({ min: 1, max: 2000 }).trim().escape(),
    body('symptoms').isLength({ min: 1, max: 2000 }).trim().escape(),
    body('prescriptions').isLength({ max: 2000 }).trim().escape(),
    body('remarks').isLength({ max: 2000 }).trim().escape(),
    body('dateTime').isISO8601().toDate(),
    body('assignees').optional({ nullable: true }).isArray().withMessage('Assignees must be an array of staff IDs'),
    handleValidationErrors
  ],
  update: [
    commonValidations.medicalRecordId,
    body('patientId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Patient ID must be a positive integer'),
    body('appointmentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Appointment ID must be a positive integer'),
    body('diagnosis').optional({ nullable: true }).isLength({ min: 1, max: 2000 }).trim().escape(),
    body('symptoms').optional({ nullable: true }).isLength({ min: 1, max: 2000 }).trim().escape(),
    body('prescriptions').optional({ nullable: true }).isLength({ max: 2000 }).trim().escape(),
    body('remarks').optional({ nullable: true }).isLength({ max: 2000 }).trim().escape(),
    body('dateTime').optional({ nullable: true }).isISO8601().toDate(),
    body('assignees').optional({ nullable: true }).isArray().withMessage('Assignees must be an array of staff IDs'),
    handleValidationErrors
  ]
};

// Acupoint validation schemas
const acupointValidation = {
  create: [
    body('acupointCode').isLength({ min: 1, max: 10 }).trim().toUpperCase(),
    body('acupointName').isLength({ min: 1, max: 100 }).trim().escape(),
    body('isBilateral').isBoolean(),
    handleValidationErrors
  ],
  update: [
    param('acupointCode').optional({ nullable: true }).isLength({ min: 1, max: 10 }).trim().toUpperCase(),
    body('acupointName').optional({ nullable: true }).isLength({ min: 1, max: 100 }).trim().escape(),
    body('isBilateral').optional({ nullable: true }).isBoolean(),
    handleValidationErrors
  ]
};

const IllnessCategoryEnum = {
  CARDIOVASCULAR: "Cardiovascular",
  NEURO_PSYCHIATRIC: "Neuro - Psychiatric",
  LOCOMOTOR: "Locomotor",
  RESPIRATORY_SYSTEM: "Respiratory system",
  DIGESTIVE_SYSTEM: "Digestive system",
  URINARY_SYSTEM: "Urinary system",
  OBSTETRICS_GYNECOLOGY: "Obstetrics and Gynecology",
  ENT: "ENT / Otolaryngology",
  ENDOCRINE_SYSTEM: "Endocrine system",
  INFECTION: "Infection",
  OTHERS: "Others"
};

// Illness validation schemas
const illnessValidation = {
  create: [
    body('illnessName').isLength({ min: 1, max: 100 }).trim().escape(),
    body('description').isLength({ max: 2000 }).trim().escape(),
    body('category').isIn(Object.values(IllnessCategoryEnum)).isLength({ max: 50 }).trim().escape(),
    handleValidationErrors
  ],
  update: [
    param('illnessId').optional({ nullable: true }).isInt({ min: 1 }),
    body('illnessName').optional({ nullable: true }).isLength({ min: 1, max: 100 }).trim().escape(),
    body('description').optional({ nullable: true }).isLength({ max: 2000 }).trim().escape(),
    body('category').optional({ nullable: true }).isIn(Object.values(IllnessCategoryEnum)).isLength({ max: 50 }).trim().escape(),
    handleValidationErrors
  ]
};

// Gemini AI validation schemas
const geminiValidation = {
  suggest: [
    body('symptoms').optional({ nullable: true }).isLength({ min: 1, max: 2000 }).trim().escape(),
    handleValidationErrors
  ]
};

// Medical record illness validation schemas
const medicalRecordIllnessValidation = {
  create: [
    param('recordId').isInt({ min: 1 }),
    body('illnessId').isInt({ min: 1 }),
    handleValidationErrors
  ]
};

// Medical record acupuncture validation schemas
const medicalRecordAcupunctureValidation = {
  create: [
    param('recordId').isInt({ min: 1 }),
    body('acupunctureId').isInt({ min: 1 }),
    body('lateralSide').optional({ nullable: true }).isIn(['LEFT', 'RIGHT', 'BOTH', 'NONE', 'left', 'right', 'both', 'none', 'Left', 'Right', 'Both', 'None']).withMessage('Lateral side must be Left, Right, Both, or None'),
    handleValidationErrors
  ]
};

// Acupoint location validation schemas
const acupointLocationValidation = {
  create: [
    body('meridianId').isInt({ min: 1 }),
    body('acupointCode').isLength({ min: 1, max: 10 }).trim().toUpperCase(),
    body('pointTop').isFloat(),
    body('pointLeft').isFloat(),
    handleValidationErrors
  ],
  update: [
    param('locationId').isInt({ min: 1 }),
    body('meridianId').isInt({ min: 1 }),
    body('acupointCode').isLength({ min: 1, max: 10 }).trim().toUpperCase(),
    body('pointTop').isFloat(),
    body('pointLeft').isFloat(),
    handleValidationErrors
  ]
};

// Acupuncture validation schemas
const acupunctureValidation = {
  create: [
    body('acupointCode').isLength({ min: 1, max: 10 }).trim().toUpperCase(),
    body('meridianId').isInt({ min: 1 }),
    handleValidationErrors
  ],
  update: [
    param('acupunctureId').isInt({ min: 1 }),
    body('acupointCode').isLength({ min: 1, max: 10 }).trim().toUpperCase(),
    body('meridianId').isInt({ min: 1 }),
    handleValidationErrors
  ]
};

// Illness acupuncture validation schemas
const illnessAcupunctureValidation = {
  create: [
    body('illnessId').isInt({ min: 1 }),
    body('acupunctureId').isInt({ min: 1 }),
    handleValidationErrors
  ]
};

// Meridian validation schemas
const meridianValidation = {
  create: [
    body('meridianName').isLength({ min: 1, max: 100 }).trim().escape(),
    body('image').isLength({ max: 100 }).trim().escape(),
    handleValidationErrors
  ],
  update: [
    param('meridianId').isInt({ min: 1 }),
    body('meridianName').isLength({ min: 1, max: 100 }).trim().escape(),
    body('image').isLength({ max: 100 }).trim().escape(),
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  staffValidation,
  patientValidation,
  appointmentValidation,
  medicalRecordValidation,
  acupointValidation,
  illnessValidation,
  geminiValidation,
  medicalRecordIllnessValidation,
  medicalRecordAcupunctureValidation,
  acupointLocationValidation,
  acupunctureValidation,
  illnessAcupunctureValidation,
  meridianValidation
};

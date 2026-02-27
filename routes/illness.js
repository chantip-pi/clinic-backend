const express = require("express");
const {
  listIllnesses,
  getIllnessById,
  addIllness,
  editIllness,
  removeIllness,
} = require("../controllers/illness");

const auth = require("../middleware/auth");
const { illnessValidation } = require('../middleware/validation');
const router = express.Router();

router.get("/illnesses", auth, listIllnesses);
router.get("/illnesses/:illnessId", auth, getIllnessById);
router.post("/illnesses", auth, illnessValidation.create, addIllness);
router.put("/illnesses/:illnessId", auth, illnessValidation.update, editIllness);
router.delete("/illnesses/:illnessId", auth, removeIllness);

module.exports = router;

const express = require("express");
const {
  listIllnesses,
  getIllnessById,
  addIllness,
  editIllness,
  removeIllness,
} = require("../controllers/illness");

const auth = require("../middleware/auth");
const router = express.Router();

router.get("/illnesses", auth, listIllnesses);
router.get("/illnesses/:illnessId", auth, getIllnessById);
router.post("/illnesses", auth, addIllness);
router.put("/illnesses/:illnessId", auth, editIllness);
router.delete("/illnesses/:illnessId", auth, removeIllness);

module.exports = router;

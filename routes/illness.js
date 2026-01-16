const express = require("express");
const {
  listIllnesses,
  getIllnessById,
  addIllness,
  editIllness,
  removeIllness,
} = require("../controllers/illness");

const router = express.Router();

router.get("/illnesses", listIllnesses);
router.get("/illnesses/:illnessId", getIllnessById);
router.post("/illnesses", addIllness);
router.put("/illnesses/:illnessId", editIllness);
router.delete("/illnesses/:illnessId", removeIllness);

module.exports = router;

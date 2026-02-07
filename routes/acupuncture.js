const express = require("express");
const {
  listAcupunctures,
  getAcupunctureById,
  addAcupuncture,
  editAcupuncture,
  removeAcupuncture,
} = require("../controllers/acupuncture");

const router = express.Router();

router.get("/acupunctures", listAcupunctures);
router.get("/acupunctures/:acupunctureId", getAcupunctureById);
router.post("/acupunctures", addAcupuncture);
router.put("/acupunctures/:acupunctureId", editAcupuncture);
router.delete("/acupunctures/:acupunctureId", removeAcupuncture);

module.exports = router;

const express = require("express");
const {
  listAcupointLocations,
  getAcupointLocationById,
  addAcupointLocation,
  editAcupointLocation,
  removeAcupointLocation,
} = require("../controllers/acupointLocation");

const auth = require("../middleware/auth");
const router = express.Router();

router.get("/acupointLocations", auth, listAcupointLocations);
router.get("/acupointLocations/:locationId", auth, getAcupointLocationById);
router.post("/acupointLocations", auth, addAcupointLocation);
router.put("/acupointLocations/:locationId", auth, editAcupointLocation);
router.delete("/acupointLocations/:locationId", auth, removeAcupointLocation);

module.exports = router;

const express = require("express");
const {
  listAcupointLocations,
  getAcupointLocationById,
  addAcupointLocation,
  editAcupointLocation,
  removeAcupointLocation,
} = require("../controllers/acupointLocation");

const router = express.Router();

router.get("/acupointLocations", listAcupointLocations);
router.get("/acupointLocations/:locationId", getAcupointLocationById);
router.post("/acupointLocations", addAcupointLocation);
router.put("/acupointLocations/:locationId", editAcupointLocation);
router.delete("/acupointLocations/:locationId", removeAcupointLocation);

module.exports = router;

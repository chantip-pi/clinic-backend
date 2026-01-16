const express = require("express");
const {
  listAcupointLocations,
  getAcupointLocationById,
  addAcupointLocation,
  editAcupointLocation,
  removeAcupointLocation,
} = require("../controllers/acupointLocation");

const router = express.Router();

router.get("/acupoint-locations", listAcupointLocations);
router.get("/acupoint-locations/:locationId", getAcupointLocationById);
router.post("/acupoint-locations", addAcupointLocation);
router.put("/acupoint-locations/:locationId", editAcupointLocation);
router.delete("/acupoint-locations/:locationId", removeAcupointLocation);

module.exports = router;

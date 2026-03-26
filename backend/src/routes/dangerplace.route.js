import express from "express";
import {
  addDangerPlace,
  getNearbyDangerPlaces,
} from "../controllers/dangerplace.controller.js";

const router = express.Router();

router.post("/add-danger-place", addDangerPlace);
router.post("/nearby-danger-places", getNearbyDangerPlaces);

export default router;

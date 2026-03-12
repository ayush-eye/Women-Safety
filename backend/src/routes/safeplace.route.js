import express from "express";
import {
  addSafePlace,
  getNearbySafePlaces,
} from "../controllers/safeplace.controller.js";

const router = express.Router();

router.post("/add-safe-place", addSafePlace);
router.post("/nearby-safe-places", getNearbySafePlaces);

export default router;

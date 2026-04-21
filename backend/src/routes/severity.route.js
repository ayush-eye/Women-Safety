import express from 'express';
import { getSeverityNearby } from '../controllers/severity.controller.js';

const router = express.Router();

router.post('/nearby', getSeverityNearby);

export default router;

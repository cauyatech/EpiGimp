import express from 'express';
import * as filterController from '../controllers/filterController.ts';

const router = express.Router();

// Apply filters to images
router.post('/apply', filterController.applyFilter);

export default router;

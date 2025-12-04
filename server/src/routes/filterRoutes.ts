import express from 'express';
import * as filterController from '../controllers/filterController.ts';

const router = express.Router();

router.post('/apply', filterController.applyFilter);

export default router;

import express from 'express';
import * as projectController from '../controllers/projectController.ts';

const router = express.Router();

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProject);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;

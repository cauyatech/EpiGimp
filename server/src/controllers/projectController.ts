import type { Request, Response } from 'express';
import Project from '../models/Project.ts';

/**
 * POST /api/projects - Create a new project
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, width, height, layers } = req.body;

    if (!name || !width || !height) {
      return res.status(400).json({
        error: 'Missing required fields: name, width, height',
      });
    }

    if (width < 1 || width > 10000 || height < 1 || height > 10000) {
      return res.status(400).json({
        error: 'Invalid canvas dimensions (must be between 1 and 10000)',
      });
    }

    const project = new Project({
      name,
      width,
      height,
      layers: layers || [],
    });

    await project.save();

    res.status(201).json({
      id: project._id,
      name: project.name,
      width: project.width,
      height: project.height,
      layers: project.layers,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({
      error: 'Failed to create project',
      details: error.message,
    });
  }
};

/**
 * GET /api/projects - Get list of all projects
 */
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .select('_id name width height createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(50);

    const projectList = projects.map((p: any) => ({
      id: p._id,
      name: p.name,
      width: p.width,
      height: p.height,
      updatedAt: p.updatedAt,
      createdAt: p.createdAt,
    }));

    res.json(projectList);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      details: error.message,
    });
  }
};

/**
 * GET /api/projects/:id - Get a specific project with full layer data
 */
export const getProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
      });
    }

    res.json({
      id: project._id,
      name: project.name,
      width: project.width,
      height: project.height,
      layers: project.layers,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid project ID format',
      });
    }

    res.status(500).json({
      error: 'Failed to fetch project',
      details: error.message,
    });
  }
};

/**
 * PUT /api/projects/:id - Update an existing project
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, width, height, layers } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
      });
    }

    if (name !== undefined) project.name = name;
    if (width !== undefined) project.width = width;
    if (height !== undefined) project.height = height;
    if (layers !== undefined) project.layers = layers;

    await project.save();

    res.json({
      id: project._id,
      name: project.name,
      width: project.width,
      height: project.height,
      layers: project.layers,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({
      error: 'Failed to update project',
      details: error.message,
    });
  }
};

/**
 * DELETE /api/projects/:id - Delete a project
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
      });
    }

    res.json({
      message: 'Project deleted successfully',
      id: project._id,
    });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      details: error.message,
    });
  }
};

import type { Request, Response } from 'express';

// In-memory storage (replace with database in production)
const projects: any[] = [];

export const getAllProjects = (req: Request, res: Response) => {
  res.json(projects);
};

export const getProject = (req: Request, res: Response) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
};

export const createProject = (req: Request, res: Response) => {
  const newProject = {
    id: Date.now().toString(),
    name: req.body.name || 'Untitled Project',
    width: req.body.width || 800,
    height: req.body.height || 600,
    layers: req.body.layers || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  projects.push(newProject);
  res.status(201).json(newProject);
};

export const updateProject = (req: Request, res: Response) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  projects[index] = {
    ...projects[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json(projects[index]);
};

export const deleteProject = (req: Request, res: Response) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  projects.splice(index, 1);
  res.status(204).send();
};

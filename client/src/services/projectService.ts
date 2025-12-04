/**
 * projectService.ts
 * Service for saving/loading projects to/from the backend API
 * Handles serialization of canvas layers to base64 PNG
 */

import axios from 'axios';
import type { Project, ProjectListItem } from '../types/project.ts'

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Save a project to the database
 * Converts all layer canvases to base64 PNG strings
 */
export async function saveProject(projectData: {
  name: string;
  width: number;
  height: number;
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    opacity: number;
    index: number;
  }>;
}): Promise<Project> {
  // Capture image data for each layer
  const layersWithImageData = projectData.layers.map(layer => {
    const canvas = document.getElementById(layer.id) as HTMLCanvasElement;
    const imageData = canvas ? canvas.toDataURL('image/png') : '';
    
    return {
      ...layer,
      imageData,
    };
  });

  const response = await axios.post<Project>(`${API_BASE_URL}/projects`, {
    ...projectData,
    layers: layersWithImageData,
  });

  return response.data;
}

/**
 * Get list of all projects (for "recent projects" list)
 */
export async function getProjects(): Promise<ProjectListItem[]> {
  const response = await axios.get<ProjectListItem[]>(`${API_BASE_URL}/projects`);
  return response.data;
}

/**
 * Load a specific project by ID
 * Returns full project with all layer image data
 */
export async function loadProject(id: string): Promise<Project> {
  const response = await axios.get<Project>(`${API_BASE_URL}/projects/${id}`);
  return response.data;
}

/**
 * Delete a project by ID
 */
export async function deleteProject(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/projects/${id}`);
}

/**
 * Restore a project's layers to canvases
 * Creates Image objects from base64 data and draws them on canvases
 */
export function restoreProjectToCanvases(project: Project): Promise<void> {
  return new Promise((resolve) => {
    let loadedCount = 0;
    const totalLayers = project.layers.length;

    if (totalLayers === 0) {
      resolve();
      return;
    }

    project.layers.forEach(layer => {
      if (!layer.imageData) {
        loadedCount++;
        if (loadedCount === totalLayers) resolve();
        return;
      }

      const canvas = document.getElementById(layer.id) as HTMLCanvasElement;
      if (!canvas) {
        loadedCount++;
        if (loadedCount === totalLayers) resolve();
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        loadedCount++;
        if (loadedCount === totalLayers) resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        loadedCount++;
        if (loadedCount === totalLayers) resolve();
      };
      img.onerror = () => {
        console.error(`Failed to load image for layer ${layer.name}`);
        loadedCount++;
        if (loadedCount === totalLayers) resolve();
      };
      img.src = layer.imageData;
    });
  });
}

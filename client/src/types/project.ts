/**
 * project.ts
 * TypeScript types for Project, Layer, and related data structures
 */

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  index: number;
  imageData?: string | null; // base64 PNG string for save/load
}

export interface Project {
  id?: string;
  name: string;
  width: number;
  height: number;
  layers: Layer[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectListItem {
  id: string;
  name: string;
  width: number;
  height: number;
  updatedAt: Date;
}

export interface Tool {
  id: 'brush' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'select' | 'crop' | 'move' | 'colorPicker';
  name: string;
  icon: string;
  cursor: string;
}

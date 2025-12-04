/**
 * Project.ts
 * Mongoose model for storing EpiGimp projects
 * Stores project metadata and layer data (including base64 PNG images)
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ILayer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  index: number;
  imageData?: string; // base64 PNG string
}

export interface IProject extends Document {
  name: string;
  width: number;
  height: number;
  layers: ILayer[];
  createdAt: Date;
  updatedAt: Date;
}

const LayerSchema = new Schema<ILayer>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  visible: { type: Boolean, default: true },
  opacity: { type: Number, default: 1, min: 0, max: 1 },
  index: { type: Number, required: true },
  imageData: { type: String }, // base64 encoded PNG
});

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    width: {
      type: Number,
      required: [true, 'Canvas width is required'],
      min: [1, 'Width must be at least 1'],
      max: [10000, 'Width cannot exceed 10000'],
    },
    height: {
      type: Number,
      required: [true, 'Canvas height is required'],
      min: [1, 'Height must be at least 1'],
      max: [10000, 'Height cannot exceed 10000'],
    },
    layers: {
      type: [LayerSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
ProjectSchema.index({ updatedAt: -1 });
ProjectSchema.index({ name: 1 });

const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;

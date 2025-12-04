import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  name: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  importedImage: string | null;
  imageOffset: { x: number; y: number };
}

const initialState: ProjectState = {
  name: 'Untitled Project',
  canvasWidth: 800,
  canvasHeight: 600,
  backgroundColor: '#ffffff',
  importedImage: null,
  imageOffset: { x: 0, y: 0 },
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setCanvasSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.canvasWidth = action.payload.width;
      state.canvasHeight = action.payload.height;
    },
    setBackgroundColor: (state, action: PayloadAction<string>) => {
      state.backgroundColor = action.payload;
    },
    setImportedImage: (state, action: PayloadAction<string | null>) => {
      state.importedImage = action.payload;
    },
    setImageOffset: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.imageOffset = action.payload;
    },
  },
});

export const { setProjectName, setCanvasSize, setBackgroundColor, setImportedImage, setImageOffset } = projectSlice.actions;

export default projectSlice.reducer;

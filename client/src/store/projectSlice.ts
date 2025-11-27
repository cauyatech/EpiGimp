import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  name: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
}

const initialState: ProjectState = {
  name: 'Untitled Project',
  canvasWidth: 800,
  canvasHeight: 600,
  backgroundColor: '#ffffff',
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
  },
});

export const { setProjectName, setCanvasSize, setBackgroundColor } = projectSlice.actions;

export default projectSlice.reducer;

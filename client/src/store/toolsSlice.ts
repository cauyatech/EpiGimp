import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Tool = 'move' | 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line';

interface ToolsState {
  activeTool: Tool;
  brushSize: number;
  color: string;
  eraserSize: number;
  shouldClearCanvas: boolean;
}

const initialState: ToolsState = {
  activeTool: 'brush',
  brushSize: 5,
  color: '#000000',
  eraserSize: 20,
  shouldClearCanvas: false,
};

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setActiveTool: (state, action: PayloadAction<Tool>) => {
      state.activeTool = action.payload;
    },
    setBrushSize: (state, action: PayloadAction<number>) => {
      state.brushSize = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    setEraserSize: (state, action: PayloadAction<number>) => {
      state.eraserSize = action.payload;
    },
    triggerClearCanvas: (state) => {
      state.shouldClearCanvas = true;
    },
    resetClearCanvas: (state) => {
      state.shouldClearCanvas = false;
    },
  },
});

export const { setActiveTool, setBrushSize, setColor, setEraserSize, triggerClearCanvas, resetClearCanvas } = toolsSlice.actions;

export default toolsSlice.reducer;

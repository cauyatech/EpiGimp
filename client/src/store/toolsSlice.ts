import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Tool = 'move' | 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'select' | 'crop';

interface ToolsState {
  activeTool: Tool;
  brushSize: number;
  color: string;
  eraserSize: number;
  shouldClearCanvas: boolean;
  selectionRect: { x: number; y: number; width: number; height: number } | null;
  cropRect: { x: number; y: number; width: number; height: number } | null;
}

const initialState: ToolsState = {
  activeTool: 'brush',
  brushSize: 5,
  color: '#000000',
  eraserSize: 20,
  shouldClearCanvas: false,
  selectionRect: null,
  cropRect: null,
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
    setSelectionRect: (state, action: PayloadAction<{ x: number; y: number; width: number; height: number } | null>) => {
      state.selectionRect = action.payload;
    },
    setCropRect: (state, action: PayloadAction<{ x: number; y: number; width: number; height: number } | null>) => {
      state.cropRect = action.payload;
    },
  },
});

export const { setActiveTool, setBrushSize, setColor, setEraserSize, triggerClearCanvas, resetClearCanvas, setSelectionRect, setCropRect } = toolsSlice.actions;

export default toolsSlice.reducer;

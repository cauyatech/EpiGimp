import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  imageData: string | null;
}

interface LayersState {
  layers: Layer[];
  selectedLayerId: string | null;
}

const initialState: LayersState = {
  layers: [
    {
      id: 'layer-1',
      name: 'Background',
      visible: true,
      opacity: 1,
      imageData: null,
    },
  ],
  selectedLayerId: 'layer-1',
};

const layersSlice = createSlice({
  name: 'layers',
  initialState,
  reducers: {
    addLayer: (state, action: PayloadAction<{ name: string }>) => {
      const newLayer: Layer = {
        id: `layer-${Date.now()}`,
        name: action.payload.name,
        visible: true,
        opacity: 1,
        imageData: null,
      };
      state.layers.push(newLayer);
      state.selectedLayerId = newLayer.id;
    },
    removeLayer: (state, action: PayloadAction<string>) => {
      state.layers = state.layers.filter((layer) => layer.id !== action.payload);
      if (state.selectedLayerId === action.payload) {
        state.selectedLayerId = state.layers[0]?.id || null;
      }
    },
    selectLayer: (state, action: PayloadAction<string>) => {
      state.selectedLayerId = action.payload;
    },
    toggleLayerVisibility: (state, action: PayloadAction<string>) => {
      const layer = state.layers.find((l) => l.id === action.payload);
      if (layer) {
        layer.visible = !layer.visible;
      }
    },
    setLayerOpacity: (state, action: PayloadAction<{ id: string; opacity: number }>) => {
      const layer = state.layers.find((l) => l.id === action.payload.id);
      if (layer) {
        layer.opacity = action.payload.opacity;
      }
    },
    renameLayer: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const layer = state.layers.find((l) => l.id === action.payload.id);
      if (layer) {
        layer.name = action.payload.name;
      }
    },
    updateLayerData: (state, action: PayloadAction<{ id: string; imageData: string }>) => {
      const layer = state.layers.find((l) => l.id === action.payload.id);
      if (layer) {
        layer.imageData = action.payload.imageData;
      }
    },
    reorderLayers: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedLayer] = state.layers.splice(fromIndex, 1);
      state.layers.splice(toIndex, 0, movedLayer);
    },
  },
});

export const {
  addLayer,
  removeLayer,
  selectLayer,
  toggleLayerVisibility,
  setLayerOpacity,
  renameLayer,
  updateLayerData,
  reorderLayers,
} = layersSlice.actions;

export default layersSlice.reducer;

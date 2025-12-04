/**
 * filtersSlice.ts
 * Redux slice for managing image filters
 * Supports grayscale, brightness, contrast, and blur filters
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  grayscale: boolean;
  brightness: number; // -100 to 100
  contrast: number;   // -100 to 100
  blur: number;       // 0 to 20 (pixels)
  isActive: boolean;  // master toggle for all filters
}

const initialState: FilterState = {
  grayscale: false,
  brightness: 0,
  contrast: 0,
  blur: 0,
  isActive: false,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setGrayscale: (state, action: PayloadAction<boolean>) => {
      state.grayscale = action.payload;
      state.isActive = true;
    },
    setBrightness: (state, action: PayloadAction<number>) => {
      state.brightness = action.payload;
      state.isActive = true;
    },
    setContrast: (state, action: PayloadAction<number>) => {
      state.contrast = action.payload;
      state.isActive = true;
    },
    setBlur: (state, action: PayloadAction<number>) => {
      state.blur = action.payload;
      state.isActive = true;
    },
    resetFilters: (state) => {
      state.grayscale = false;
      state.brightness = 0;
      state.contrast = 0;
      state.blur = 0;
      state.isActive = false;
    },
    toggleFilters: (state) => {
      state.isActive = !state.isActive;
    },
  },
});

export const {
  setGrayscale,
  setBrightness,
  setContrast,
  setBlur,
  resetFilters,
  toggleFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;

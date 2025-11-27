import { configureStore } from '@reduxjs/toolkit';
import layersReducer from './layersSlice';
import toolsReducer from './toolsSlice';
import projectReducer from './projectSlice';

export const store = configureStore({
  reducer: {
    layers: layersReducer,
    tools: toolsReducer,
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

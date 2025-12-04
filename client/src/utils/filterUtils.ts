/**
 * filterUtils.ts
 * Utility functions for applying image filters using Canvas API
 * All filters work on pixel data using getImageData/putImageData
 */

import type { FilterState } from '../store/filtersSlice';

/**
 * Apply grayscale filter to image data
 */
export function applyGrayscale(imageData: ImageData): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;     // R
    data[i + 1] = avg; // G
    data[i + 2] = avg; // B
    // data[i + 3] is alpha, leave unchanged
  }
  return imageData;
}

/**
 * Apply brightness adjustment (-100 to 100)
 */
export function applyBrightness(imageData: ImageData, brightness: number): ImageData {
  const data = imageData.data;
  const adjust = (brightness / 100) * 255;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + adjust));     // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adjust)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adjust)); // B
  }
  return imageData;
}

/**
 * Apply contrast adjustment (-100 to 100)
 */
export function applyContrast(imageData: ImageData, contrast: number): ImageData {
  const data = imageData.data;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));       // R
    data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128)); // G
    data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128)); // B
  }
  return imageData;
}

/**
 * Apply simple box blur (0 to 20 pixels)
 * Uses a basic box blur algorithm for performance
 */
export function applyBlur(imageData: ImageData, radius: number): ImageData {
  if (radius <= 0) return imageData;
  
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const tempData = new Uint8ClampedArray(data);
  
  const r = Math.floor(radius);
  
  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let totalR = 0, totalG = 0, totalB = 0, totalA = 0;
      let count = 0;
      
      for (let kx = -r; kx <= r; kx++) {
        const px = x + kx;
        if (px >= 0 && px < width) {
          const idx = (y * width + px) * 4;
          totalR += tempData[idx];
          totalG += tempData[idx + 1];
          totalB += tempData[idx + 2];
          totalA += tempData[idx + 3];
          count++;
        }
      }
      
      const idx = (y * width + x) * 4;
      data[idx] = totalR / count;
      data[idx + 1] = totalG / count;
      data[idx + 2] = totalB / count;
      data[idx + 3] = totalA / count;
    }
  }
  
  // Vertical pass
  tempData.set(data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let totalR = 0, totalG = 0, totalB = 0, totalA = 0;
      let count = 0;
      
      for (let ky = -r; ky <= r; ky++) {
        const py = y + ky;
        if (py >= 0 && py < height) {
          const idx = (py * width + x) * 4;
          totalR += tempData[idx];
          totalG += tempData[idx + 1];
          totalB += tempData[idx + 2];
          totalA += tempData[idx + 3];
          count++;
        }
      }
      
      const idx = (y * width + x) * 4;
      data[idx] = totalR / count;
      data[idx + 1] = totalG / count;
      data[idx + 2] = totalB / count;
      data[idx + 3] = totalA / count;
    }
  }
  
  return imageData;
}

/**
 * Apply all active filters to a canvas context
 * This is non-destructive: we get original image data, apply filters, and put it back
 */
export function applyFiltersToCanvas(
  ctx: CanvasRenderingContext2D,
  originalImageData: ImageData,
  filters: FilterState
): void {
  if (!filters.isActive) return;
  
  // Clone the original data to avoid mutating it
  let filteredData = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );
  
  // Apply filters in order
  if (filters.grayscale) {
    filteredData = applyGrayscale(filteredData);
  }
  
  if (filters.brightness !== 0) {
    filteredData = applyBrightness(filteredData, filters.brightness);
  }
  
  if (filters.contrast !== 0) {
    filteredData = applyContrast(filteredData, filters.contrast);
  }
  
  if (filters.blur > 0) {
    filteredData = applyBlur(filteredData, filters.blur);
  }
  
  // Put filtered data back
  ctx.putImageData(filteredData, 0, 0);
}

/**
 * Store original image data for a layer (for non-destructive filtering)
 */
export function captureOriginalImageData(canvas: HTMLCanvasElement): ImageData | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

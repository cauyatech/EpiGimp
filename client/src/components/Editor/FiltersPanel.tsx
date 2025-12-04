import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import {
  setGrayscale,
  setBrightness,
  setContrast,
  setBlur,
  resetFilters,
  toggleFilters,
} from '../../store/filtersSlice';
import { useEffect, useRef } from 'react';
import { applyFiltersToCanvas, captureOriginalImageData } from '../../utils/filterUtils';

export default function FiltersPanel() {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const { selectedLayerId, layers } = useSelector((state: RootState) => state.layers);
  const { canvasWidth, canvasHeight } = useSelector((state: RootState) => state.project);
  
  const originalImageDataRef = useRef<ImageData | null>(null);
  const lastLayerCountRef = useRef(layers.length);
  
  useEffect(() => {
    if (!selectedLayerId) return;
    
    const layerCountChanged = layers.length !== lastLayerCountRef.current;
    if (layerCountChanged) {
      lastLayerCountRef.current = layers.length;
      originalImageDataRef.current = null;
    }
    
    const canvas = document.getElementById(selectedLayerId) as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setTimeout(() => {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const hasContent = imageData.data.some((value, index) => {
            if (index % 4 === 3) return value > 0;
            return false;
          });
          
          if (hasContent) {
            originalImageDataRef.current = captureOriginalImageData(canvas);
          }
        }, 150);
      }
    }
  }, [selectedLayerId, canvasWidth, canvasHeight, layers.length]);
  
  useEffect(() => {
    if (!selectedLayerId) return;
    
    const canvas = document.getElementById(selectedLayerId) as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (!originalImageDataRef.current || !filters.isActive) {
      const currentData = captureOriginalImageData(canvas);
      if (currentData) {
        originalImageDataRef.current = currentData;
      }
    }
    
    if (!originalImageDataRef.current) return;
    
    if (filters.isActive) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.putImageData(originalImageDataRef.current, 0, 0);
      
      const freshOriginal = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      applyFiltersToCanvas(ctx, freshOriginal, filters);
    } else {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.putImageData(originalImageDataRef.current, 0, 0);
    }
  }, [filters, selectedLayerId, canvasWidth, canvasHeight]);

  const handleRecaptureOriginal = () => {
    if (!selectedLayerId) return;
    const canvas = document.getElementById(selectedLayerId) as HTMLCanvasElement;
    if (canvas) {
      originalImageDataRef.current = captureOriginalImageData(canvas);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#252526]">
      <div className="p-4 border-b border-[#3e3e42] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Filtres</h2>
        <button
          onClick={() => dispatch(toggleFilters())}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            filters.isActive
              ? 'bg-[#bb86fc] text-white'
              : 'bg-[#3e3e42] text-gray-300 hover:bg-[#505050]'
          }`}
        >
          {filters.isActive ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Grayscale */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Grayscale</label>
            <input
              type="checkbox"
              checked={filters.grayscale}
              onChange={(e) => dispatch(setGrayscale(e.target.checked))}
              className="w-4 h-4 rounded border-gray-600 bg-[#1e1e1e] text-[#bb86fc] focus:ring-[#bb86fc] focus:ring-offset-0"
            />
          </div>
        </div>

        {/* Brightness */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Luminosité</label>
            <span className="text-xs text-gray-500">{filters.brightness}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={filters.brightness}
            onChange={(e) => dispatch(setBrightness(Number(e.target.value)))}
            className="w-full h-2 bg-[#3e3e42] rounded-lg appearance-none cursor-pointer accent-[#bb86fc]"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Contraste</label>
            <span className="text-xs text-gray-500">{filters.contrast}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={filters.contrast}
            onChange={(e) => dispatch(setContrast(Number(e.target.value)))}
            className="w-full h-2 bg-[#3e3e42] rounded-lg appearance-none cursor-pointer accent-[#bb86fc]"
          />
        </div>

        {/* Blur */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Flou</label>
            <span className="text-xs text-gray-500">{filters.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={filters.blur}
            onChange={(e) => dispatch(setBlur(Number(e.target.value)))}
            className="w-full h-2 bg-[#3e3e42] rounded-lg appearance-none cursor-pointer accent-[#bb86fc]"
          />
        </div>

        <div className="pt-4 border-t border-[#3e3e42] space-y-2">
          <button
            onClick={() => dispatch(resetFilters())}
            className="w-full px-4 py-2 bg-[#3e3e42] hover:bg-[#505050] text-gray-300 text-sm rounded transition-colors"
          >
            Réinitialiser les filtres
          </button>
          
          <button
            onClick={handleRecaptureOriginal}
            className="w-full px-4 py-2 bg-[#3e3e42] hover:bg-[#505050] text-gray-300 text-sm rounded transition-colors"
            title="Capturer l'image actuelle comme nouvelle base"
          >
            Appliquer définitivement
          </button>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t border-[#3e3e42]">
          <p className="mb-1">💡 Les filtres sont non-destructifs</p>
          <p>Cliquez sur "Appliquer définitivement" pour valider les changements</p>
        </div>
      </div>
    </div>
  );
}

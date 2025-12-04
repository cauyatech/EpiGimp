/**
 * TopToolbar.tsx
 * Barre d'outils supérieure avec contrôles couleur, taille, et actions
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setBrushSize, setColor, triggerClearCanvas } from '../../store/toolsSlice';
import { addLayer } from '../../store/layersSlice';
import ExportButton from './ExportButton';

export default function TopToolbar() {
  const dispatch = useDispatch();
  const { brushSize, color } = useSelector((state: RootState) => state.tools);

  const handleImageImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Créer un nouveau calque avec l'image
        dispatch(addLayer({ name: file.name }));
        
        // Attendre que le calque soit créé puis dessiner l'image
        setTimeout(() => {
          const layers = document.querySelectorAll('canvas[id^="layer-"]');
          const lastLayer = layers[layers.length - 1] as HTMLCanvasElement;
          if (lastLayer) {
            const ctx = lastLayer.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
            }
          }
        }, 100);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4 flex-1">
      {/* Sélecteur de couleur */}
      <div className="flex items-center gap-2 bg-[#1e1e1e] px-3 py-2 rounded-md border border-[#3e3e42]">
        <span className="text-xs font-medium text-gray-400">Couleur</span>
        <label 
          className="w-10 h-10 rounded cursor-pointer border-2 border-[#3e3e42] hover:border-[#bb86fc] transition-all shadow-sm"
          style={{ backgroundColor: color }}
          title={`Couleur: ${color}`}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => dispatch(setColor(e.target.value))}
            className="w-0 h-0 opacity-0 absolute"
          />
        </label>
      </div>

      {/* Slider de taille */}
      <div className="flex items-center gap-3 bg-[#1e1e1e] px-4 py-2 rounded-md border border-[#3e3e42]">
        <span className="text-xs font-medium text-gray-400">Taille</span>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => dispatch(setBrushSize(Number(e.target.value)))}
          className="w-32 h-2 bg-[#3e3e42] rounded-full cursor-pointer accent-[#bb86fc]"
        />
        <span className="text-sm font-mono text-gray-300 min-w-[2rem] text-center bg-[#2d2d30] px-2 py-1 rounded">
          {brushSize}
        </span>
      </div>

      <div className="flex-1"></div>

      {/* Boutons d'action */}
      <div className="flex items-center gap-2">
        <ExportButton />

        <label className="px-4 py-2 bg-[#2d2d30] hover:bg-[#3e3e42] text-gray-200 rounded-md transition-all cursor-pointer text-sm font-medium flex items-center gap-2 border border-[#3e3e42]">
          <span>📂</span>
          <span>Importer</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageImport}
            className="hidden"
          />
        </label>

        <button
          onClick={() => {
            if (window.confirm('Voulez-vous vraiment effacer le calque actif ?')) {
              dispatch(triggerClearCanvas());
            }
          }}
          className="px-4 py-2 bg-[#2d2d30] hover:bg-red-900/30 text-gray-200 rounded-md transition-all text-sm font-medium flex items-center gap-2 border border-[#3e3e42] hover:border-red-500"
        >
          <span>🗑️</span>
          <span>Effacer</span>
        </button>
      </div>
    </div>
  );
}

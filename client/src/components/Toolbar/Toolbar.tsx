import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setBrushSize, setColor, triggerClearCanvas } from '../../store/toolsSlice';

export default function Toolbar() {
  const dispatch = useDispatch();
  const { brushSize, color } = useSelector((state: RootState) => state.tools);

  return (
    <div className="flex items-center gap-2 w-full overflow-x-auto">
      {/* Indicateur de couleur principale (double carré style GIMP) */}
      <div className="flex items-center gap-1">
        <div className="relative w-12 h-12">
          {/* Couleur de premier plan */}
          <label 
            className="absolute top-0 left-0 w-8 h-8 border-2 border-white rounded cursor-pointer hover:scale-105 transition-transform z-10 shadow-lg"
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
          {/* Couleur de fond (blanc) */}
          <div 
            className="absolute bottom-0 right-0 w-8 h-8 border-2 border-[#1a1a1a] rounded"
            style={{ backgroundColor: '#ffffff' }}
          />
        </div>
      </div>

      <div className="h-8 w-px bg-[#1a1a1a]"></div>

      {/* Contrôles style GIMP */}
      <div className="flex items-center gap-3 bg-[#2e2e2e] px-3 py-1.5 rounded border border-[#1a1a1a]">
        {/* Couleur */}
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Couleur</span>
            <label className="w-10 h-10 rounded border-2 border-[#1a1a1a] overflow-hidden cursor-pointer hover:border-[#4a90e2] transition-colors shadow-inner block"
                 style={{ backgroundColor: color }}
                 title={`Couleur: ${color}`}>
                <input
                type="color"
                value={color}
                onChange={(e) => dispatch(setColor(e.target.value))}
                className="w-0 h-0 opacity-0 absolute"
                />
            </label>
        </div>

        {/* Taille */}
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Taille</span>
            <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => dispatch(setBrushSize(Number(e.target.value))) }
            className="w-24 h-1.5 bg-[#1a1a1a] rounded cursor-pointer accent-[#4a90e2]"
            />
            <span className="text-xs font-mono text-gray-300 min-w-[1.5rem] text-center">{brushSize}</span>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Bouton Effacer style GIMP */}
      <button
        onClick={() => {
          if (window.confirm('Voulez-vous vraiment tout effacer ?')) {
            dispatch(triggerClearCanvas());
          }
        }}
        className="px-3 py-1.5 bg-[#3c3c3c] text-gray-300 border border-[#1a1a1a] rounded hover:bg-[#505050] transition-all flex items-center gap-2 text-sm"
        title="Tout effacer"
      >
        <span>🗑️</span>
        <span className="hidden lg:inline">Effacer</span>
      </button>
    </div>
  );
}
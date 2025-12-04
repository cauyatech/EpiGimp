/**
 * ToolbarLeft.tsx
 * Barre d'outils verticale gauche avec tous les outils de dessin
 * Design moderne avec icônes grandes et lisibles
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setActiveTool } from '../../store/toolsSlice';
import type { Tool } from '../../store/toolsSlice';

interface ToolItem {
  id: Tool;
  label: string;
  icon: string;
  description: string;
}

const tools: ToolItem[] = [
  { id: 'brush', label: 'Pinceau', icon: '🖌️', description: 'Dessiner librement' },
  { id: 'eraser', label: 'Gomme', icon: '🧹', description: 'Effacer le dessin' },
  { id: 'colorPicker', label: 'Pipette', icon: '🎨', description: 'Prélever une couleur' },
  { id: 'line', label: 'Ligne', icon: '/', description: 'Tracer une ligne' },
  { id: 'rectangle', label: 'Rectangle', icon: '▭', description: 'Tracer un rectangle' },
  { id: 'circle', label: 'Cercle', icon: '○', description: 'Tracer un cercle' },
  { id: 'crop', label: 'Recadrer', icon: '✂️', description: 'Recadrer l\'image' },
];

export default function ToolbarLeft() {
  const dispatch = useDispatch();
  const { activeTool } = useSelector((state: RootState) => state.tools);

  return (
    <div className="h-full flex flex-col items-center py-4 gap-3">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => dispatch(setActiveTool(tool.id))}
          className={`
            group relative w-24 h-24 rounded-xl transition-all duration-200
            flex flex-col items-center justify-center gap-1
            ${activeTool === tool.id
              ? 'bg-[#bb86fc] text-white shadow-lg shadow-[#bb86fc]/30 scale-105'
              : 'bg-[#2d2d30] text-gray-400 hover:bg-[#3e3e42] hover:text-gray-200 hover:scale-105'
            }
          `}
          title={tool.description}
          aria-label={tool.label}
        >
          <span className="text-4xl">{tool.icon}</span>
          <span className="text-[9px] font-medium opacity-70">{tool.label}</span>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-3 py-2 bg-[#2d2d30] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-[#3e3e42]">
            {tool.label}
            <div className="text-[10px] text-gray-400 mt-0.5">{tool.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

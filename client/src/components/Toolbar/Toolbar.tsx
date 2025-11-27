import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setActiveTool, setBrushSize, setColor, triggerClearCanvas } from '../../store/toolsSlice';
import type { Tool } from '../../store/toolsSlice';

export default function Toolbar() {
  const dispatch = useDispatch();
  const { activeTool, brushSize, color } = useSelector((state: RootState) => state.tools);

  const tools: { id: Tool; label: string; icon: string }[] = [
    { id: 'move', label: 'Déplacer', icon: '✋' },
    { id: 'brush', label: 'Pinceau', icon: '🖌️' },
    { id: 'eraser', label: 'Gomme', icon: '🧹' },
    { id: 'rectangle', label: 'Rectangle', icon: '▭' },
    { id: 'circle', label: 'Cercle', icon: '○' },
    { id: 'line', label: 'Ligne', icon: '/' },
  ];

  return (
    <div className="flex items-center gap-6 w-full">
      {/* Outils */}
      <div className="flex gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => dispatch(setActiveTool(tool.id))}
            className={`px-4 py-2 rounded shadow-sm transition-all flex items-center gap-2 ${
              activeTool === tool.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            title={tool.label}
          >
            <span className="text-lg">{tool.icon}</span>
            <span className="text-sm font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Séparateur */}
      <div className="h-8 w-px bg-gray-300"></div>

      {/* Couleur */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Couleur:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => dispatch(setColor(e.target.value))}
          className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
        />
      </div>

      {/* Taille du pinceau */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Taille:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => dispatch(setBrushSize(Number(e.target.value)))}
          className="w-32"
        />
        <span className="text-sm text-gray-600 w-8 text-center">{brushSize}</span>
      </div>

      {/* Séparateur */}
      <div className="h-8 w-px bg-gray-300"></div>

      {/* Bouton Tout effacer */}
      <button
        onClick={() => {
          if (window.confirm('Voulez-vous vraiment tout effacer ?')) {
            dispatch(triggerClearCanvas());
          }
        }}
        className="px-4 py-2 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 transition-all flex items-center gap-2"
        title="Tout effacer"
      >
        <span className="text-lg">🗑️</span>
        <span className="text-sm font-medium">Effacer tout</span>
      </button>
    </div>
  );
}

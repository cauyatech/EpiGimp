import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setActiveTool } from '../../store/toolsSlice';
import type { Tool } from '../../store/toolsSlice';

export default function ToolPanel() {
  const dispatch = useDispatch();
  const { activeTool } = useSelector((state: RootState) => state.tools);

  const tools: { id: Tool; label: string; icon: string }[] = [
    { id: 'move', label: 'Déplacer', icon: '✋' },
    { id: 'brush', label: 'Pinceau', icon: '🖌️' },
    { id: 'eraser', label: 'Gomme', icon: '🧹' },
    { id: 'rectangle', label: 'Rectangle', icon: '▭' },
    { id: 'circle', label: 'Cercle', icon: '○' },
    { id: 'line', label: 'Ligne', icon: '/' },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 bg-white border-r shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Outils</h3>
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => dispatch(setActiveTool(tool.id))}
          className={`p-3 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
            activeTool === tool.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title={tool.label}
        >
          <span className="text-2xl">{tool.icon}</span>
          <span className="text-xs font-medium">{tool.label}</span>
        </button>
      ))}
    </div>
  );
}

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
    <div className="w-16 bg-[#3c3c3c] border-r border-[#1a1a1a] flex flex-col p-1 gap-1">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => dispatch(setActiveTool(tool.id))}
          className={`w-14 h-14 rounded transition-all flex items-center justify-center text-2xl ${
            activeTool === tool.id
              ? 'bg-[#4a90e2] text-white'
              : 'bg-[#2e2e2e] text-gray-300 hover:bg-[#505050]'
          }`}
          title={tool.label}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}

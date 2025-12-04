import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function Debug() {
  const { activeTool, brushSize, color } = useSelector((state: RootState) => state.tools);
  const { selectedLayerId, layers } = useSelector((state: RootState) => state.layers);
  const { canvasWidth, canvasHeight } = useSelector((state: RootState) => state.project);

  return (
    <div className="fixed bottom-4 left-4 bg-[#1a1a1a] text-white p-3 rounded border border-[#4a90e2] text-xs font-mono z-[9999] max-w-xs">
      <div className="font-bold mb-2 text-[#4a90e2]">🔧 DEBUG</div>
      <div><strong>Outil:</strong> {activeTool}</div>
      <div><strong>Taille:</strong> {brushSize}px</div>
      <div><strong>Couleur:</strong> <span style={{ backgroundColor: color, padding: '2px 8px', marginLeft: '4px', border: '1px solid white' }}>{color}</span></div>
      <div><strong>Canvas:</strong> {canvasWidth}x{canvasHeight}</div>
      <div><strong>Calques:</strong> {layers.length}</div>
      <div><strong>Calque actif:</strong> {selectedLayerId}</div>
      <div className="mt-2 text-[10px] text-gray-400">
        {layers.map(l => (
          <div key={l.id} className={l.id === selectedLayerId ? 'text-[#4a90e2]' : ''}>
            • {l.name} {l.id === selectedLayerId ? '✓' : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

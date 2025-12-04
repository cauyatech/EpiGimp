import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { addLayer, removeLayer, selectLayer, toggleLayerVisibility, setLayerOpacity } from '../../store/layersSlice';

export default function LayerPanel() {
  const dispatch = useDispatch();
  const { layers, selectedLayerId } = useSelector((state: RootState) => state.layers);

  const handleAddLayer = () => {
    const layerName = `Calque ${layers.length + 1}`;
    dispatch(addLayer({ name: layerName }));
  };

  return (
    <div className="h-full flex flex-col bg-[#3c3c3c] text-gray-200">
      <div className="p-2 border-b border-[#1a1a1a] flex items-center justify-between bg-[#3c3c3c]">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">Calques</h2>
        <button
          onClick={handleAddLayer}
          className="px-2 py-1 bg-[#2e2e2e] hover:bg-[#505050] text-gray-300 rounded border border-[#1a1a1a] transition-colors flex items-center gap-1 text-xs"
          title="Nouveau calque"
        >
          <span>➕</span>
          <span>Nouveau</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            onClick={() => dispatch(selectLayer(layer.id))}
            className={`group p-2 rounded cursor-pointer border transition-all select-none ${
              selectedLayerId === layer.id
                ? 'bg-[#4a90e2] border-[#4a90e2]'
                : 'bg-[#2e2e2e] border-[#1a1a1a] hover:bg-[#3c3c3c] hover:border-[#505050]'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(toggleLayerVisibility(layer.id));
                }}
                className={`text-sm p-1 rounded transition-all ${
                  layer.visible 
                    ? 'hover:bg-[#505050]' 
                    : 'opacity-50 grayscale'
                }`}
              >
                {layer.visible ? '👁️' : '🚫'}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{layer.name}</div>
              </div>

              {layers.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Supprimer "${layer.name}" ?`)) {
                      dispatch(removeLayer(layer.id));
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1 transition-opacity text-xs"
                  title="Supprimer"
                >
                  ✕
                </button>
              )}
            </div>
            
            {selectedLayerId === layer.id && (
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">Opacité</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={layer.opacity * 100}
                        onChange={(e) => dispatch(setLayerOpacity({ id: layer.id, opacity: Number(e.target.value) / 100 }))}
                        className="flex-1 h-1 bg-[#1a1a1a] rounded cursor-pointer accent-[#4a90e2]"
                    />
                    <span className="text-[10px] text-gray-300 min-w-[2rem] text-right">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

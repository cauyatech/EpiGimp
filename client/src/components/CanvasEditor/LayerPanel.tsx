import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { addLayer, removeLayer, selectLayer, toggleLayerVisibility } from '../../store/layersSlice';

export default function LayerPanel() {
  const dispatch = useDispatch();
  const { layers, selectedLayerId } = useSelector((state: RootState) => state.layers);

  const handleAddLayer = () => {
    const layerName = `Calque ${layers.length + 1}`;
    dispatch(addLayer({ name: layerName }));
  };

  const handleRemoveLayer = (layerId: string) => {
    if (layers.length > 1) {
      dispatch(removeLayer(layerId));
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Calques</h2>
        <button
          onClick={handleAddLayer}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
        >
          + Nouveau
        </button>
      </div>

      <div className="flex-1 overflow-auto space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            onClick={() => dispatch(selectLayer(layer.id))}
            className={`p-3 border rounded cursor-pointer transition-all ${
              selectedLayerId === layer.id
                ? 'bg-blue-100 border-blue-500'
                : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(toggleLayerVisibility(layer.id));
                  }}
                  className="text-lg"
                  title={layer.visible ? 'Cacher' : 'Afficher'}
                >
                  {layer.visible ? '👁️' : '👁️‍🗨️'}
                </button>
                <span className="text-sm font-medium text-gray-700">{layer.name}</span>
              </div>
              {layers.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveLayer(layer.id);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-bold"
                  title="Supprimer le calque"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="100"
                value={layer.opacity * 100}
                readOnly
                className="w-full h-1"
                title={`Opacité: ${Math.round(layer.opacity * 100)}%`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

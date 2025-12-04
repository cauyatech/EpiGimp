import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setCanvasSize } from '../../store/projectSlice';

interface CanvasSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [
  { name: 'Carré 800×800', width: 800, height: 800 },
  { name: 'HD 1280×720', width: 1280, height: 720 },
  { name: 'Full HD 1920×1080', width: 1920, height: 1080 },
  { name: 'Portrait 600×800', width: 600, height: 800 },
  { name: 'Paysage 1000×600', width: 1000, height: 600 },
  { name: 'Instagram 1080×1080', width: 1080, height: 1080 },
];

export default function CanvasSizeModal({ isOpen, onClose }: CanvasSizeModalProps) {
  const dispatch = useDispatch();
  const { canvasWidth, canvasHeight } = useSelector((state: RootState) => state.project);
  
  const [width, setWidth] = useState(canvasWidth);
  const [height, setHeight] = useState(canvasHeight);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    if (width < 1 || width > 5000) {
      setError('La largeur doit être entre 1 et 5000 pixels');
      return;
    }
    if (height < 1 || height > 5000) {
      setError('La hauteur doit être entre 1 et 5000 pixels');
      return;
    }

    dispatch(setCanvasSize({ width, height }));
    onClose();
  };

  const handlePreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-[#252526] rounded-lg shadow-2xl w-full max-w-2xl border border-[#3e3e42]">
        <div className="p-6 border-b border-[#3e3e42]">
          <h2 className="text-xl font-bold text-gray-100">Taille du Canvas</h2>
          <p className="text-sm text-gray-400 mt-1">
            Actuel: {canvasWidth} × {canvasHeight} px
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Dimensions personnalisées */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Dimensions personnalisées</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">Largeur (px)</label>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={width}
                  onChange={(e) => {
                    setWidth(Number(e.target.value));
                    setError('');
                  }}
                  className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#3e3e42] rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#bb86fc]"
                />
              </div>
              <div className="flex items-end pb-2 text-gray-500 text-2xl">×</div>
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">Hauteur (px)</label>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={height}
                  onChange={(e) => {
                    setHeight(Number(e.target.value));
                    setError('');
                  }}
                  className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#3e3e42] rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#bb86fc]"
                />
              </div>
            </div>
          </div>

          {/* Presets */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Tailles prédéfinies</h3>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePreset(preset.width, preset.height)}
                  className={`px-4 py-3 rounded transition-colors text-left ${
                    width === preset.width && height === preset.height
                      ? 'bg-[#bb86fc] text-white'
                      : 'bg-[#3e3e42] text-gray-300 hover:bg-[#505050]'
                  }`}
                >
                  <div className="font-medium text-sm">{preset.name}</div>
                  <div className="text-xs opacity-75">{preset.width} × {preset.height} px</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Warning */}
          {(width !== canvasWidth || height !== canvasHeight) && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-yellow-400 text-sm">
              ⚠️ Attention: Modifier la taille du canvas ne redimensionnera pas les calques existants.
              Le contenu peut être rogné ou déplacé.
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end p-4 border-t border-[#3e3e42]">
          <button
            onClick={() => {
              setWidth(canvasWidth);
              setHeight(canvasHeight);
              setError('');
              onClose();
            }}
            className="px-4 py-2 bg-[#3e3e42] hover:bg-[#505050] text-gray-300 rounded transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-[#bb86fc] hover:bg-[#a66efc] text-white rounded transition-colors"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}

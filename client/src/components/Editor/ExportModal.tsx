import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(0.92);
  const [isExporting, setIsExporting] = useState(false);

  const { layers } = useSelector((state: RootState) => state.layers);
  const { canvasWidth, canvasHeight } = useSelector((state: RootState) => state.project);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const compositor = document.createElement('canvas');
      compositor.width = canvasWidth;
      compositor.height = canvasHeight;
      const ctx = compositor.getContext('2d');

      if (!ctx) {
        throw new Error('Could not create canvas context');
      }

      if (format === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      for (const layer of layers) {
        if (!layer.visible) continue;

        const canvas = document.getElementById(layer.id) as HTMLCanvasElement;
        if (!canvas) continue;

        ctx.save();
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
      }

      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = format === 'png' 
        ? compositor.toDataURL(mimeType)
        : compositor.toDataURL(mimeType, quality);

      const link = document.createElement('a');
      link.download = `epigimp-export-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-[#252526] rounded-lg shadow-2xl w-full max-w-md border border-[#3e3e42]">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Exporter le projet</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Format d'export
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormat('png')}
                  className={`flex-1 px-4 py-3 rounded transition-colors ${
                    format === 'png'
                      ? 'bg-[#bb86fc] text-white'
                      : 'bg-[#3e3e42] text-gray-300 hover:bg-[#505050]'
                  }`}
                >
                  <div className="font-semibold">PNG</div>
                  <div className="text-xs opacity-75">Transparence supportée</div>
                </button>
                <button
                  onClick={() => setFormat('jpeg')}
                  className={`flex-1 px-4 py-3 rounded transition-colors ${
                    format === 'jpeg'
                      ? 'bg-[#bb86fc] text-white'
                      : 'bg-[#3e3e42] text-gray-300 hover:bg-[#505050]'
                  }`}
                >
                  <div className="font-semibold">JPEG</div>
                  <div className="text-xs opacity-75">Plus petit fichier</div>
                </button>
              </div>
            </div>

            {format === 'jpeg' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Qualité JPEG
                  </label>
                  <span className="text-xs text-gray-500">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-[#3e3e42] rounded-lg appearance-none cursor-pointer accent-[#bb86fc]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Petite taille</span>
                  <span>Haute qualité</span>
                </div>
              </div>
            )}

            <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-3 text-sm text-gray-400">
              <p className="mb-1">📐 Dimensions: {canvasWidth} × {canvasHeight} px</p>
              <p className="mb-1">🎨 Calques visibles: {layers.filter(l => l.visible).length}/{layers.length}</p>
              <p className="text-xs opacity-75 mt-2">
                {format === 'png' 
                  ? 'Le PNG préserve la transparence et offre une qualité sans perte'
                  : 'Le JPEG est plus léger mais ne supporte pas la transparence'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end p-4 border-t border-[#3e3e42]">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 bg-[#3e3e42] hover:bg-[#505050] text-gray-300 rounded transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-[#bb86fc] hover:bg-[#a66efc] text-white rounded transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <span className="animate-spin">⏳</span>
                Export en cours...
              </>
            ) : (
              <>
                📥 Exporter {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

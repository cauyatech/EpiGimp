/**
 * TopToolbar.tsx
 * Barre d'outils supérieure avec contrôles couleur, taille, et actions
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setBrushSize, setColor, triggerClearCanvas, setFillShape } from '../../store/toolsSlice';
import { addLayer } from '../../store/layersSlice';
import SaveProjectModal from './SaveProjectModal';
import LoadProjectModal from './LoadProjectModal';
import ExportModal from './ExportModal';
import CanvasSizeModal from './CanvasSizeModal';

export default function TopToolbar() {
  const dispatch = useDispatch();
  const { brushSize, color, fillShape, activeTool } = useSelector((state: RootState) => state.tools);
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCanvasSizeModal, setShowCanvasSizeModal] = useState(false);
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 10));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  // Passer le zoom au workspace via un événement personnalisé
  useEffect(() => {
    const event = new CustomEvent('canvasZoom', { detail: { zoom } });
    window.dispatchEvent(event);
  }, [zoom]);

  const handleImageImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Créer un nouveau calque avec l'image
        dispatch(addLayer({ name: file.name }));
        
        // Attendre que le calque soit créé puis dessiner l'image
        setTimeout(() => {
          const layers = document.querySelectorAll('canvas[id^="layer-"]');
          const lastLayer = layers[layers.length - 1] as HTMLCanvasElement;
          if (lastLayer) {
            const ctx = lastLayer.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
            }
          }
        }, 100);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4 flex-1">
      {/* Sélecteur de couleur */}
      <div className="flex items-center gap-2 bg-[#1e1e1e] px-3 py-2 rounded-md border border-[#3e3e42]">
        <span className="text-xs font-medium text-gray-400">Couleur</span>
        <label 
          className="w-10 h-10 rounded cursor-pointer border-2 border-[#3e3e42] hover:border-[#bb86fc] transition-all shadow-sm"
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
      </div>

      {/* Slider de taille */}
      <div className="flex items-center gap-3 bg-[#1e1e1e] px-4 py-2 rounded-md border border-[#3e3e42]">
        <span className="text-xs font-medium text-gray-400">Taille</span>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => dispatch(setBrushSize(Number(e.target.value)))}
          className="w-32 h-2 bg-[#3e3e42] rounded-full cursor-pointer accent-[#bb86fc]"
        />
        <span className="text-sm font-mono text-gray-300 min-w-[2rem] text-center bg-[#2d2d30] px-2 py-1 rounded">
          {brushSize}
        </span>
      </div>

      {/* Fill toggle for shapes */}
      {(activeTool === 'rectangle' || activeTool === 'circle') && (
        <div className="flex items-center gap-2 bg-[#1e1e1e] px-3 py-2 rounded-md border border-[#3e3e42]">
          <input
            type="checkbox"
            id="fill-shape"
            checked={fillShape}
            onChange={(e) => dispatch(setFillShape(e.target.checked))}
            className="w-4 h-4 rounded border-gray-600 bg-[#2d2d30] text-[#bb86fc] focus:ring-[#bb86fc] focus:ring-offset-0"
          />
          <label htmlFor="fill-shape" className="text-xs font-medium text-gray-400 cursor-pointer">
            Remplir
          </label>
        </div>
      )}

      <div className="flex-1"></div>

      {/* Boutons d'action */}
      <div className="flex items-center gap-2">
        {/* Save Project */}
        <button
          onClick={() => setShowSaveModal(true)}
          className="px-4 py-2 bg-[#2d2d30] hover:bg-[#3e3e42] text-gray-200 rounded-md transition-all text-sm font-medium flex items-center gap-2 border border-[#3e3e42]"
          title="Sauvegarder le projet"
        >
          <span>💾</span>
          <span>Sauvegarder</span>
        </button>

        {/* Load Project */}
        <button
          onClick={() => setShowLoadModal(true)}
          className="px-4 py-2 bg-[#2d2d30] hover:bg-[#3e3e42] text-gray-200 rounded-md transition-all text-sm font-medium flex items-center gap-2 border border-[#3e3e42]"
          title="Charger un projet"
        >
          <span>📁</span>
          <span>Charger</span>
        </button>

        {/* Export */}
        <button
          onClick={() => setShowExportModal(true)}
          className="px-4 py-2 bg-[#bb86fc] hover:bg-[#a66efc] text-white rounded-md transition-all text-sm font-medium flex items-center gap-2 border border-[#bb86fc]"
          title="Exporter l'image"
        >
          <span>📥</span>
          <span>Exporter</span>
        </button>

        <label className="px-4 py-2 bg-[#2d2d30] hover:bg-[#3e3e42] text-gray-200 rounded-md transition-all cursor-pointer text-sm font-medium flex items-center gap-2 border border-[#3e3e42]">
          <span>📂</span>
          <span>Importer</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageImport}
            className="hidden"
          />
        </label>

        <button
          onClick={() => setShowCanvasSizeModal(true)}
          className="px-4 py-2 bg-[#2d2d30] hover:bg-[#3e3e42] text-gray-200 rounded-md transition-all text-sm font-medium flex items-center gap-2 border border-[#3e3e42]"
          title="Changer la taille du canvas"
        >
          <span>📐</span>
          <span>Taille</span>
        </button>

        {/* Contrôles de zoom */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#2d2d30] rounded-md border border-[#3e3e42]">
          <button
            onClick={handleZoomOut}
            className="px-2 py-1 hover:bg-[#3e3e42] rounded transition-all text-lg"
            title="Dézoomer (Ctrl + -)"
          >
            🔍−
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-1 hover:bg-[#3e3e42] rounded transition-all text-xs font-medium min-w-[50px]"
            title="Réinitialiser (Ctrl + 0)"
          >
            {zoom}%
          </button>
          <button
            onClick={handleZoomIn}
            className="px-2 py-1 hover:bg-[#3e3e42] rounded transition-all text-lg"
            title="Zoomer (Ctrl + +)"
          >
            🔍+
          </button>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Voulez-vous vraiment effacer le calque actif ?')) {
              dispatch(triggerClearCanvas());
            }
          }}
          className="px-4 py-2 bg-[#2d2d30] hover:bg-red-900/30 text-gray-200 rounded-md transition-all text-sm font-medium flex items-center gap-2 border border-[#3e3e42] hover:border-red-500"
        >
          <span>🗑️</span>
          <span>Effacer</span>
        </button>
      </div>

      {/* Modals */}
      <SaveProjectModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)}
        onSaved={() => {
          // Optionally show a success message
          alert('Projet sauvegardé avec succès!');
        }}
      />
      
      <LoadProjectModal 
        isOpen={showLoadModal} 
        onClose={() => setShowLoadModal(false)}
      />
      
      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)}
      />
      
      <CanvasSizeModal 
        isOpen={showCanvasSizeModal} 
        onClose={() => setShowCanvasSizeModal(false)}
      />
    </div>
  );
}

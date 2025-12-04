/**
 * LayersPanel.tsx
 * Panneau de gestion des calques avec drag & drop
 * Permet: ajout, suppression, réorganisation, opacité, visibilité
 */

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../../store';
import { 
  addLayer, 
  removeLayer, 
  selectLayer, 
  toggleLayerVisibility, 
  setLayerOpacity,
  renameLayer,
  reorderLayers
} from '../../store/layersSlice';

export default function LayersPanel() {
  const dispatch = useDispatch();
  const { layers, selectedLayerId } = useSelector((state: RootState) => state.layers);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);

  const handleAddLayer = () => {
    const layerNumber = layers.length + 1;
    dispatch(addLayer({ name: `Calque ${layerNumber}` }));
  };

  const handleRename = (layerId: string, currentName: string) => {
    setEditingLayerId(layerId);
    setEditingName(currentName);
  };

  const saveRename = (layerId: string) => {
    if (editingName.trim()) {
      dispatch(renameLayer({ id: layerId, name: editingName.trim() }));
    }
    setEditingLayerId(null);
  };

  const handleDragStart = (e: React.DragEvent, layerId: string) => {
    setDraggedLayerId(layerId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    if (draggedLayerId && draggedLayerId !== targetLayerId) {
      const fromIndex = layers.findIndex(l => l.id === draggedLayerId);
      const toIndex = layers.findIndex(l => l.id === targetLayerId);
      dispatch(reorderLayers({ fromIndex, toIndex }));
    }
    setDraggedLayerId(null);
  };

  return (
    <div className="h-full flex flex-col bg-[#252526]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#3e3e42] flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">
          Calques
        </h2>
        <button
          onClick={handleAddLayer}
          className="px-3 py-1.5 bg-[#bb86fc] hover:bg-[#a370e8] text-white rounded-md transition-all text-sm font-medium flex items-center gap-1.5 shadow-sm"
        >
          <span className="text-lg">+</span>
          <span>Nouveau</span>
        </button>
      </div>

      {/* Liste des calques */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {[...layers].reverse().map((layer, reverseIndex) => {
          const originalIndex = layers.length - 1 - reverseIndex;
          const isSelected = selectedLayerId === layer.id;
          const isEditing = editingLayerId === layer.id;
          const isDragging = draggedLayerId === layer.id;

          return (
            <div
              key={layer.id}
              draggable
              onDragStart={(e) => handleDragStart(e, layer.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, layer.id)}
              onClick={() => dispatch(selectLayer(layer.id))}
              className={`
                group relative p-3 rounded-lg cursor-pointer border-2 transition-all
                ${isDragging ? 'opacity-50' : 'opacity-100'}
                ${isSelected 
                  ? 'bg-[#bb86fc]/20 border-[#bb86fc]' 
                  : 'bg-[#2d2d30] border-[#3e3e42] hover:bg-[#3e3e42] hover:border-[#4e4e52]'
                }
              `}
            >
              {/* Indicateur d'ordre */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#bb86fc] rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                {originalIndex + 1}
              </div>

              <div className="flex items-center gap-2 ml-4">
                {/* Toggle visibilité */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(toggleLayerVisibility(layer.id));
                  }}
                  className={`text-xl p-1 rounded hover:bg-[#3e3e42] transition-all ${
                    !layer.visible && 'opacity-40 grayscale'
                  }`}
                  title={layer.visible ? 'Masquer' : 'Afficher'}
                >
                  {layer.visible ? '👁️' : '🚫'}
                </button>

                {/* Nom du calque */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => saveRename(layer.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename(layer.id);
                        if (e.key === 'Escape') setEditingLayerId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="w-full px-2 py-1 bg-[#1e1e1e] border border-[#bb86fc] rounded text-sm text-gray-200 focus:outline-none"
                    />
                  ) : (
                    <div
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleRename(layer.id, layer.name);
                      }}
                      className="text-sm font-medium text-gray-200 truncate"
                      title="Double-cliquer pour renommer"
                    >
                      {layer.name}
                    </div>
                  )}
                </div>

                {/* Bouton supprimer */}
                {layers.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Supprimer "${layer.name}" ?`)) {
                        dispatch(removeLayer(layer.id));
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1 transition-all text-lg"
                    title="Supprimer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Slider d'opacité (visible si sélectionné) */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-[#3e3e42]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-16">Opacité</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layer.opacity * 100}
                      onChange={(e) => dispatch(setLayerOpacity({ 
                        id: layer.id, 
                        opacity: Number(e.target.value) / 100 
                      }))}
                      className="flex-1 h-2 bg-[#1e1e1e] rounded-full cursor-pointer accent-[#bb86fc]"
                    />
                    <span className="text-xs font-mono text-gray-300 w-12 text-right bg-[#1e1e1e] px-2 py-1 rounded">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer avec infos */}
      <div className="px-4 py-3 border-t border-[#3e3e42] text-xs text-gray-400">
        <div className="flex justify-between">
          <span>{layers.length} calque{layers.length > 1 ? 's' : ''}</span>
          <span className="text-[#bb86fc]">Glisser pour réorganiser</span>
        </div>
      </div>
    </div>
  );
}

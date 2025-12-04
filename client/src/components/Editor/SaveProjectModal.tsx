/**
 * SaveProjectModal.tsx
 * Modal dialog for saving the current project to database
 */

import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { saveProject } from '../../services/projectService';

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function SaveProjectModal({ isOpen, onClose, onSaved }: SaveProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const { layers } = useSelector((state: RootState) => state.layers);
  const { canvasWidth, canvasHeight } = useSelector((state: RootState) => state.project);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!projectName.trim()) {
      setError('Veuillez entrer un nom de projet');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await saveProject({
        name: projectName.trim(),
        width: canvasWidth,
        height: canvasHeight,
        layers: layers.map(layer => ({
          id: layer.id,
          name: layer.name,
          visible: layer.visible,
          opacity: layer.opacity,
          index: layers.indexOf(layer),
        })),
      });

      onSaved?.();
      onClose();
      setProjectName('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-[#252526] rounded-lg shadow-2xl w-full max-w-md border border-[#3e3e42]">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Sauvegarder le projet</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom du projet
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Mon super projet"
                className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#3e3e42] rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#bb86fc]"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>

            <div className="text-sm text-gray-400">
              <p>📐 Dimensions: {canvasWidth} × {canvasHeight} px</p>
              <p>🎨 Calques: {layers.length}</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end p-4 border-t border-[#3e3e42]">
          <button
            onClick={() => {
              onClose();
              setProjectName('');
              setError('');
            }}
            disabled={isSaving}
            className="px-4 py-2 bg-[#3e3e42] hover:bg-[#505050] text-gray-300 rounded transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !projectName.trim()}
            className="px-4 py-2 bg-[#bb86fc] hover:bg-[#a66efc] text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}

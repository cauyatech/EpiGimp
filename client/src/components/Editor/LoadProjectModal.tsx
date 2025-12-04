/**
 * LoadProjectModal.tsx
 * Modal dialog for loading saved projects from database
 */

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProjects, loadProject, deleteProject, restoreProjectToCanvases } from '../../services/projectService';
import { setLayers } from '../../store/layersSlice';
import { setCanvasSize } from '../../store/projectSlice';
import type { ProjectListItem } from '../../types/project';

interface LoadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoadProjectModal({ isOpen, onClose }: LoadProjectModalProps) {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err: any) {
      setError('Erreur lors du chargement de la liste');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadProject = async (id: string) => {
    setIsLoadingProject(true);
    setError('');
    
    try {
      const project = await loadProject(id);
      
      // Update Redux store with project data
      dispatch(setCanvasSize({ width: project.width, height: project.height }));
      
      // Convert project layers to Redux layer format
      const reduxLayers = project.layers.map(layer => ({
        ...layer,
        imageData: layer.imageData || null, // Convert undefined to null
      }));
      
      dispatch(setLayers(reduxLayers));

      // Wait for DOM to update with new canvas elements
      await new Promise(resolve => setTimeout(resolve, 100));

      // Restore layer images to canvases
      await restoreProjectToCanvases(project);

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setIsLoadingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce projet ?')) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      setError('Erreur lors de la suppression');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-[#252526] rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] border border-[#3e3e42] flex flex-col">
        <div className="p-6 border-b border-[#3e3e42]">
          <h2 className="text-xl font-bold text-gray-100">Charger un projet</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="text-center py-8 text-gray-400">
              Chargement...
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          {!isLoading && projects.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">Aucun projet sauvegardé</p>
              <p className="text-sm">Créez et sauvegardez votre premier projet!</p>
            </div>
          )}

          {!isLoading && projects.length > 0 && (
            <div className="space-y-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-[#1e1e1e] border border-[#3e3e42] rounded hover:border-[#bb86fc] transition-colors group"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-100 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {project.width} × {project.height} px • {formatDate(project.updatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoadProject(project.id)}
                      disabled={isLoadingProject}
                      className="px-4 py-2 bg-[#bb86fc] hover:bg-[#a66efc] text-white rounded transition-colors disabled:opacity-50"
                    >
                      Charger
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={isLoadingProject}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoadingProject && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-[#252526] px-6 py-4 rounded-lg shadow-xl">
                <p className="text-gray-100">Chargement du projet...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t border-[#3e3e42]">
          <button
            onClick={onClose}
            disabled={isLoadingProject}
            className="px-4 py-2 bg-[#3e3e42] hover:bg-[#505050] text-gray-300 rounded transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

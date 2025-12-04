/**
 * ExportButton.tsx
 * Bouton avec menu dropdown pour exporter l'image
 */

import { useState, useRef, useEffect } from 'react';
import { useCanvasCompositor } from '../../hooks/useCanvasCompositor';

export default function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { exportComposedImage, copyToClipboard } = useCanvasCompositor();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'png' | 'jpeg' | 'webp') => {
    exportComposedImage(format);
    setIsOpen(false);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard();
    if (success) {
      alert('Image copiée dans le presse-papier !');
    } else {
      alert('Échec de la copie dans le presse-papier');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-[#bb86fc] hover:bg-[#a370e8] text-white rounded-md transition-all text-sm font-medium flex items-center gap-2 shadow-lg"
      >
        <span>💾</span>
        <span>Exporter</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#2d2d30] border border-[#3e3e42] rounded-lg shadow-2xl overflow-hidden z-50">
          <button
            onClick={() => handleExport('png')}
            className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-[#3e3e42] transition-colors flex items-center gap-3"
          >
            <span>🖼️</span>
            <span>PNG (recommandé)</span>
          </button>
          <button
            onClick={() => handleExport('jpeg')}
            className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-[#3e3e42] transition-colors flex items-center gap-3"
          >
            <span>📷</span>
            <span>JPEG</span>
          </button>
          <button
            onClick={() => handleExport('webp')}
            className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-[#3e3e42] transition-colors flex items-center gap-3"
          >
            <span>🌐</span>
            <span>WebP</span>
          </button>
          <div className="h-px bg-[#3e3e42] my-1"></div>
          <button
            onClick={handleCopy}
            className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-[#3e3e42] transition-colors flex items-center gap-3"
          >
            <span>📋</span>
            <span>Copier</span>
          </button>
        </div>
      )}
    </div>
  );
}

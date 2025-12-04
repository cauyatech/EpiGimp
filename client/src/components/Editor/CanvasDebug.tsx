/**
 * CanvasDebug.tsx
 * Composant de debug pour afficher les infos du canvas et des événements
 * À utiliser temporairement pour déboguer le dessin
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function CanvasDebug() {
  const [lastEvent, setLastEvent] = useState<string>('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { selectedLayerId, layers } = useSelector((state: RootState) => state.layers);
  const { activeTool } = useSelector((state: RootState) => state.tools);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const selectedLayer = layers.find(l => l.id === selectedLayerId);
  const canvas = selectedLayerId ? document.getElementById(selectedLayerId) as HTMLCanvasElement : null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white text-xs p-4 rounded-lg shadow-2xl font-mono space-y-1 z-[9999] border border-[#bb86fc]">
      <div className="text-[#bb86fc] font-bold mb-2">🐛 Canvas Debug</div>
      
      <div>
        <span className="text-gray-400">Tool:</span> 
        <span className="text-green-400 ml-2">{activeTool}</span>
      </div>
      
      <div>
        <span className="text-gray-400">Mouse:</span> 
        <span className="text-blue-400 ml-2">x:{mousePos.x} y:{mousePos.y}</span>
      </div>
      
      <div>
        <span className="text-gray-400">Layer:</span> 
        <span className="text-yellow-400 ml-2">{selectedLayer?.name || 'None'}</span>
      </div>
      
      <div>
        <span className="text-gray-400">Canvas:</span> 
        <span className={canvas ? "text-green-400" : "text-red-400"} ml-2>
          {canvas ? '✓ Found' : '✗ Not found'}
        </span>
      </div>
      
      {canvas && (
        <>
          <div>
            <span className="text-gray-400">Size:</span> 
            <span className="text-purple-400 ml-2">
              {canvas.width}×{canvas.height}
            </span>
          </div>
          
          <div>
            <span className="text-gray-400">Context:</span> 
            <span className={canvas.getContext('2d') ? "text-green-400" : "text-red-400"} ml-2>
              {canvas.getContext('2d') ? '✓ OK' : '✗ Error'}
            </span>
          </div>
        </>
      )}
      
      <div>
        <span className="text-gray-400">Layers:</span> 
        <span className="text-cyan-400 ml-2">{layers.length}</span>
      </div>
      
      {lastEvent && (
        <div className="pt-2 border-t border-gray-700">
          <span className="text-gray-400">Last:</span> 
          <span className="text-orange-400 ml-2">{lastEvent}</span>
        </div>
      )}
      
      <button
        onClick={() => setLastEvent(`Test @ ${new Date().toLocaleTimeString()}`)}
        className="mt-2 px-2 py-1 bg-[#bb86fc] rounded text-xs w-full hover:bg-[#a370e8]"
      >
        Test Event
      </button>
    </div>
  );
}

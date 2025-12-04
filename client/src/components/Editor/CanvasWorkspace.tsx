/**
 * CanvasWorkspace.tsx
 * Zone de travail principale avec système multi-calques
 * Chaque calque est un canvas séparé, empilés et composés ensemble
 */

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useDrawingEngine } from '../../hooks/useDrawingEngine';

export default function CanvasWorkspace() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { layers, selectedLayerId } = useSelector((state: RootState) => state.layers);
  const { canvasWidth, canvasHeight, backgroundColor } = useSelector((state: RootState) => state.project);
  const { selectionRect, cropRect } = useSelector((state: RootState) => state.tools);
  
  const { 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp,
    getCursor 
  } = useDrawingEngine(canvasContainerRef);

  // Initialiser le fond blanc du premier calque
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstLayer = layers[0];
      if (firstLayer) {
        const canvas = document.getElementById(firstLayer.id) as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx && !ctx.getImageData(0, 0, 1, 1).data.some(val => val !== 0)) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          }
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [layers, canvasWidth, canvasHeight, backgroundColor]);

  return (
    <div 
      ref={workspaceRef}
      className="w-full h-full flex items-center justify-center p-8"
    >
      {/* Container du canvas avec shadow et bordure */}
      <div 
        ref={canvasContainerRef}
        className="relative shadow-2xl ring-1 ring-gray-700/50"
        style={{ 
          width: canvasWidth, 
          height: canvasHeight,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fond damier (transparence) */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: '#ffffff',
            backgroundImage: `
              linear-gradient(45deg, #e0e0e0 25%, transparent 25%), 
              linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #e0e0e0 75%), 
              linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            zIndex: 0
          }}
        />

        {/* Stack de canvas (un par calque) */}
        <div className="absolute inset-0" style={{ zIndex: 10 }}>
          {layers.map((layer, index) => (
            <canvas
              key={layer.id}
              id={layer.id}
              width={canvasWidth}
              height={canvasHeight}
              className="absolute top-0 left-0"
              style={{ 
                opacity: layer.opacity,
                visibility: layer.visible ? 'visible' : 'hidden',
                zIndex: 10 + index,
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>

        {/* Overlay interactif pour le dessin */}
        <div
          className="absolute"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            top: 0,
            left: 0,
            width: canvasWidth,
            height: canvasHeight,
            cursor: getCursor(),
            zIndex: 9999,
            touchAction: 'none',
            pointerEvents: 'auto',
            boxSizing: 'border-box',
          }}
        />

        {/* Rectangle de sélection */}
        {selectionRect && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
            style={{
              left: selectionRect.width >= 0 ? selectionRect.x : selectionRect.x + selectionRect.width,
              top: selectionRect.height >= 0 ? selectionRect.y : selectionRect.y + selectionRect.height,
              width: Math.abs(selectionRect.width),
              height: Math.abs(selectionRect.height),
              zIndex: 1000
            }}
          >
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              {Math.abs(Math.round(selectionRect.width))} × {Math.abs(Math.round(selectionRect.height))}
            </div>
          </div>
        )}

        {/* Rectangle de crop */}
        {cropRect && (
          <div
            className="absolute border-2 border-dashed border-yellow-500 bg-yellow-500/10 pointer-events-none"
            style={{
              left: cropRect.width >= 0 ? cropRect.x : cropRect.x + cropRect.width,
              top: cropRect.height >= 0 ? cropRect.y : cropRect.y + cropRect.height,
              width: Math.abs(cropRect.width),
              height: Math.abs(cropRect.height),
              zIndex: 1000
            }}
          >
            <div className="absolute -top-6 left-0 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-medium">
              Crop: {Math.abs(Math.round(cropRect.width))} × {Math.abs(Math.round(cropRect.height))}
            </div>
          </div>
        )}

        {/* Indicateur du calque actif */}
        <div className="absolute -top-8 left-0 text-xs text-gray-400 bg-[#252526] px-3 py-1 rounded-t border border-b-0 border-[#3e3e42]">
          Calque actif: <span className="text-[#bb86fc] font-medium">
            {layers.find(l => l.id === selectedLayerId)?.name || 'Aucun'}
          </span>
        </div>

        {/* Dimensions du canvas */}
        <div className="absolute -bottom-8 right-0 text-xs text-gray-400 bg-[#252526] px-3 py-1 rounded-b border border-t-0 border-[#3e3e42]">
          {canvasWidth} × {canvasHeight} px
        </div>
      </div>
    </div>
  );
}

import { useCanvas } from '../../hooks/useCanvas';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function CanvasEditor() {
  // Note: on récupère containerRef au lieu de canvasRef
  const { containerRef, startDrawing, draw, stopDrawing } = useCanvas();
  const { activeTool } = useSelector((state: RootState) => state.tools);
  const { layers } = useSelector((state: RootState) => state.layers);
  const { canvasWidth, canvasHeight } = useSelector((state: RootState) => state.project);

  const getCursor = () => {
    switch (activeTool) {
      case 'move': return 'move';
      case 'brush': return 'crosshair';
      case 'eraser': return 'cell'; // Curseur carré pour gomme
      default: return 'default';
    }
  };

  return (
    <div className="relative shadow-2xl border-2 border-gray-700" style={{ width: canvasWidth, height: canvasHeight, backgroundColor: '#404040' }}>
        <div className="absolute inset-0" 
             style={{ 
                 backgroundColor: '#ffffff',
                 backgroundImage: 'linear-gradient(45deg, #cccccc 25%, transparent 25%), linear-gradient(-45deg, #cccccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cccccc 75%), linear-gradient(-45deg, transparent 75%, #cccccc 75%)',
                 backgroundSize: '20px 20px',
                 backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                 zIndex: 1
             }}>
        </div>

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
                    pointerEvents: 'none'
                }}
            />
        ))}

        <div 
            ref={containerRef}
            className="absolute inset-0"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ 
              cursor: getCursor(),
              zIndex: 1000
            }}
        />
    </div>
  );
}
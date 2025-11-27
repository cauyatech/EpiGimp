import { useCanvas } from '../../hooks/useCanvas';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function CanvasEditor() {
  const { canvasRef, startDrawing, draw, stopDrawing } = useCanvas();
  const { activeTool } = useSelector((state: RootState) => state.tools);

  const getCursor = () => {
    switch (activeTool) {
      case 'move':
        return 'move';
      case 'brush':
        return 'crosshair';
      case 'eraser':
        return 'crosshair';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-gray-300 p-4 rounded-lg shadow-lg">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="bg-white border-2 border-gray-400 shadow-inner"
        style={{ cursor: getCursor() }}
      />
    </div>
  );
}

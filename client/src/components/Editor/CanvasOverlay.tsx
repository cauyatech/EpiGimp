/**
 * CanvasOverlay.tsx
 * Overlay transparent au-dessus des calques pour capturer les événements souris
 * Permet l'interaction sans affecter directement les canvas
 */

interface CanvasOverlayProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  cursor: string;
}

export default function CanvasOverlay({
  onMouseDown,
  onMouseMove,
  onMouseUp,
  cursor
}: CanvasOverlayProps) {
  
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('🎯 OVERLAY MouseDown captured:', { x: e.clientX, y: e.clientY });
    onMouseDown(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    onMouseMove(e);
  };

  console.log('🔴 CanvasOverlay RENDERING with cursor:', cursor);

  return (
    <div
      className="absolute inset-0"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        cursor,
        zIndex: 9999,
        touchAction: 'none',
        backgroundColor: 'rgba(255, 0, 0, 0.15)', // Debug: teinte rouge visible
        border: '3px solid red', // Debug: bordure rouge
        pointerEvents: 'auto', // FORCER la capture des événements
      }}
      title="Click here to draw"
    >
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        color: 'red', 
        fontWeight: 'bold',
        fontSize: '16px',
        pointerEvents: 'none',
        zIndex: 1000 
      }}>
        OVERLAY ACTIVE
      </div>
    </div>
  );
}

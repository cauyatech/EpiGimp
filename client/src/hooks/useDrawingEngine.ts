/**
 * useDrawingEngine.ts
 * Hook principal pour gérer le moteur de dessin
 * Gère tous les outils: brush, eraser, shapes, select, crop, move
 * Avec path smoothing et tracking précis
 */

import { useRef, useCallback } from 'react';
import type { RefObject } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { 
  resetClearCanvas, 
  setSelectionRect, 
  setCropRect 
} from '../store/toolsSlice';
import { setImageOffset } from '../store/projectSlice';

export const useDrawingEngine = (containerRef: RefObject<HTMLDivElement>) => {
  const dispatch = useDispatch();
  
  // Refs pour le tracking
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const savedImageData = useRef<ImageData | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const pathPoints = useRef<{ x: number; y: number }[]>([]);

  // Selectors Redux
  const { activeTool, brushSize, color, eraserSize, shouldClearCanvas, cropRect } = useSelector(
    (state: RootState) => state.tools
  );
  const { canvasWidth, canvasHeight, backgroundColor, imageOffset } = useSelector(
    (state: RootState) => state.project
  );
  const { selectedLayerId, layers } = useSelector((state: RootState) => state.layers);

  /**
   * Récupère le contexte du calque actif
   */
  const getActiveContext = useCallback(() => {
    if (!selectedLayerId) return null;
    const canvas = document.getElementById(selectedLayerId) as HTMLCanvasElement;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, [selectedLayerId]);

  /**
   * Calcule la position de la souris relative au canvas
   */
  const getMousePos = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, [containerRef]);

  /**
   * Dessine un trait lissé entre plusieurs points (path smoothing)
   */
  const drawSmoothPath = useCallback((
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[]
  ) => {
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // Utiliser des courbes de Bézier quadratiques pour lisser
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    // Dernier point
    const lastPoint = points[points.length - 1];
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.stroke();
  }, []);

  /**
   * Gestion du mousedown
   */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!selectedLayerId) {
      return;
    }

    const pos = getMousePos(e);

    // MODE MOVE: déplacer l'image
    if (activeTool === 'move') {
      isDragging.current = true;
      dragStart.current = { x: pos.x - imageOffset.x, y: pos.y - imageOffset.y };
      return;
    }

    // MODE SELECT: démarrer la sélection
    if (activeTool === 'select') {
      isDrawing.current = true;
      startPos.current = pos;
      dispatch(setSelectionRect(null));
      return;
    }

    // MODE CROP: démarrer le crop
    if (activeTool === 'crop') {
      isDrawing.current = true;
      startPos.current = pos;
      dispatch(setCropRect(null));
      return;
    }

    // Outils de dessin
    const ctx = getActiveContext();
    if (!ctx) {
      return;
    }

    isDrawing.current = true;
    lastPos.current = pos;
    startPos.current = pos;

    // Sauvegarder l'image pour les formes géométriques
    if (['rectangle', 'circle', 'line'].includes(activeTool)) {
      savedImageData.current = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    }

    // Initialiser le path pour le brush/eraser
    if (activeTool === 'brush' || activeTool === 'eraser') {
      pathPoints.current = [pos];
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }, [activeTool, getActiveContext, getMousePos, selectedLayerId, canvasWidth, canvasHeight, imageOffset, dispatch]);

  /**
   * Gestion du mousemove
   */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!selectedLayerId) return;

    const pos = getMousePos(e);

    // MODE MOVE: déplacer
    if (activeTool === 'move' && isDragging.current && dragStart.current) {
      const newX = pos.x - dragStart.current.x;
      const newY = pos.y - dragStart.current.y;
      dispatch(setImageOffset({ x: newX, y: newY }));
      return;
    }

    // MODE SELECT: dessiner le rectangle de sélection
    if (activeTool === 'select' && isDrawing.current && startPos.current) {
      dispatch(setSelectionRect({
        x: startPos.current.x,
        y: startPos.current.y,
        width: pos.x - startPos.current.x,
        height: pos.y - startPos.current.y
      }));
      return;
    }

    // MODE CROP: dessiner le rectangle de crop
    if (activeTool === 'crop' && isDrawing.current && startPos.current) {
      dispatch(setCropRect({
        x: startPos.current.x,
        y: startPos.current.y,
        width: pos.x - startPos.current.x,
        height: pos.y - startPos.current.y
      }));
      return;
    }

    if (!isDrawing.current) return;

    const ctx = getActiveContext();
    if (!ctx) return;

    // BRUSH: dessin lissé
    if (activeTool === 'brush') {
      pathPoints.current.push(pos);
      
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (pathPoints.current.length > 2) {
        drawSmoothPath(ctx, pathPoints.current.slice(-3));
      } else if (lastPos.current) {
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
      
      lastPos.current = pos;
    }
    
    // ERASER: effacement lissé
    else if (activeTool === 'eraser') {
      pathPoints.current.push(pos);
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = eraserSize || brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (pathPoints.current.length > 2) {
        drawSmoothPath(ctx, pathPoints.current.slice(-3));
      } else if (lastPos.current) {
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
      
      ctx.globalCompositeOperation = 'source-over';
      lastPos.current = pos;
    }
    
    // RECTANGLE: preview en temps réel
    else if (activeTool === 'rectangle' && startPos.current && savedImageData.current) {
      ctx.putImageData(savedImageData.current, 0, 0);
      const width = pos.x - startPos.current.x;
      const height = pos.y - startPos.current.y;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(startPos.current.x, startPos.current.y, width, height);
    }
    
    // CIRCLE: preview en temps réel
    else if (activeTool === 'circle' && startPos.current && savedImageData.current) {
      ctx.putImageData(savedImageData.current, 0, 0);
      const radiusX = Math.abs(pos.x - startPos.current.x);
      const radiusY = Math.abs(pos.y - startPos.current.y);
      ctx.beginPath();
      ctx.ellipse(startPos.current.x, startPos.current.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    }
    
    // LINE: preview en temps réel
    else if (activeTool === 'line' && startPos.current && savedImageData.current) {
      ctx.putImageData(savedImageData.current, 0, 0);
      ctx.beginPath();
      ctx.moveTo(startPos.current.x, startPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }, [activeTool, color, brushSize, eraserSize, getActiveContext, getMousePos, selectedLayerId, drawSmoothPath, imageOffset, dispatch]);

  /**
   * Gestion du mouseup
   */
  const handleMouseUp = useCallback(() => {
    // Appliquer le crop si nécessaire
    if (activeTool === 'crop' && cropRect && cropRect.width !== 0 && cropRect.height !== 0) {
      const ctx = getActiveContext();
      if (ctx) {
        const canvas = document.getElementById(selectedLayerId!) as HTMLCanvasElement;
        if (canvas) {
          const tempCanvas = document.createElement('canvas');
          const absWidth = Math.abs(cropRect.width);
          const absHeight = Math.abs(cropRect.height);
          tempCanvas.width = absWidth;
          tempCanvas.height = absHeight;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            const startX = cropRect.width < 0 ? cropRect.x + cropRect.width : cropRect.x;
            const startY = cropRect.height < 0 ? cropRect.y + cropRect.height : cropRect.y;
            
            tempCtx.drawImage(canvas, startX, startY, absWidth, absHeight, 0, 0, absWidth, absHeight);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tempCanvas, 0, 0);
          }
        }
      }
      dispatch(setCropRect(null));
    }

    // Reset de tous les états
    isDragging.current = false;
    isDrawing.current = false;
    lastPos.current = null;
    startPos.current = null;
    savedImageData.current = null;
    dragStart.current = null;
    pathPoints.current = [];
    
    const ctx = getActiveContext();
    if (ctx) ctx.closePath();
  }, [activeTool, cropRect, getActiveContext, selectedLayerId, dispatch]);

  /**
   * Effacer le canvas (déclenché par Redux)
   */
  useCallback(() => {
    if (shouldClearCanvas) {
      const ctx = getActiveContext();
      if (!ctx) return;
      
      if (selectedLayerId === layers[0]?.id) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      } else {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      }
      
      dispatch(resetClearCanvas());
    }
  }, [shouldClearCanvas, getActiveContext, selectedLayerId, layers, backgroundColor, canvasWidth, canvasHeight, dispatch])();

  /**
   * Retourne le curseur approprié selon l'outil
   */
  const getCursor = useCallback(() => {
    switch (activeTool) {
      case 'move': return 'move';
      case 'brush': return 'crosshair';
      case 'eraser': return 'cell';
      case 'select': return 'crosshair';
      case 'crop': return 'crosshair';
      case 'rectangle':
      case 'circle':
      case 'line': return 'crosshair';
      default: return 'default';
    }
  }, [activeTool]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getCursor,
  };
};

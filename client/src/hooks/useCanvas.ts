import { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { resetClearCanvas } from '../store/toolsSlice';

export const useCanvas = () => {
  const dispatch = useDispatch();
  // On utilise une ref pour le conteneur principal au lieu du canvas direct
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const savedImageData = useRef<ImageData | null>(null);

  const { activeTool, brushSize, color, eraserSize, shouldClearCanvas } = useSelector((state: RootState) => state.tools);
  const { canvasWidth, canvasHeight, backgroundColor } = useSelector((state: RootState) => state.project);
  const { selectedLayerId, layers } = useSelector((state: RootState) => state.layers);

  // Helper pour récupérer le contexte du calque ACTIF
  const getActiveContext = useCallback(() => {
    if (!selectedLayerId) return null;
    // On cherche l'élément canvas correspondant à l'ID du calque sélectionné
    const canvas = document.getElementById(selectedLayerId) as HTMLCanvasElement;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, [selectedLayerId]);

  // Initialisation du fond blanc pour le premier calque
  useEffect(() => {
    // Petite temporisation pour s'assurer que les canvas sont montés
    const timer = setTimeout(() => {
      const firstLayer = layers[0];
      if (firstLayer) {
        const canvas = document.getElementById(firstLayer.id) as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            console.log('Background initialized:', { width: canvasWidth, height: canvasHeight, color: backgroundColor });
          }
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [layers, canvasWidth, canvasHeight, backgroundColor]);

  const getMousePos = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    const ctx = getActiveContext();
    if (!ctx) {
      console.log('No context available', { selectedLayerId, layers: layers.map(l => l.id) });
      return;
    }

    const { x, y } = getMousePos(e);
    console.log('Start drawing', { x, y, tool: activeTool, color, brushSize });

    isDrawing.current = true;
    lastPos.current = { x, y };
    startPos.current = { x, y };

    if (['rectangle', 'circle', 'line'].includes(activeTool)) {
      savedImageData.current = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    }

    if (activeTool === 'brush' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }, [activeTool, canvasWidth, canvasHeight, getActiveContext, getMousePos, selectedLayerId, layers, color, brushSize]);

  const draw = useCallback((e: React.MouseEvent) => {
    if (!isDrawing.current) return;
    
    e.preventDefault();
    
    const ctx = getActiveContext();
    if (!ctx) {
      console.log('No context during draw');
      return;
    }

    const { x, y } = getMousePos(e);

    if (activeTool === 'brush') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (lastPos.current) {
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      lastPos.current = { x, y };
    } else if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = eraserSize || brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (lastPos.current) {
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      lastPos.current = { x, y };
    } else if (activeTool === 'rectangle' && startPos.current && savedImageData.current) {
      ctx.putImageData(savedImageData.current, 0, 0);
      const width = x - startPos.current.x;
      const height = y - startPos.current.y;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(startPos.current.x, startPos.current.y, width, height);
    } else if (activeTool === 'circle' && startPos.current && savedImageData.current) {
      ctx.putImageData(savedImageData.current, 0, 0);
      const radiusX = Math.abs(x - startPos.current.x);
      const radiusY = Math.abs(y - startPos.current.y);
      const centerX = startPos.current.x;
      const centerY = startPos.current.y;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    } else if (activeTool === 'line' && startPos.current && savedImageData.current) {
      ctx.putImageData(savedImageData.current, 0, 0);
      ctx.beginPath();
      ctx.moveTo(startPos.current.x, startPos.current.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }, [activeTool, color, brushSize, eraserSize, getActiveContext, getMousePos]);

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
    startPos.current = null;
    savedImageData.current = null;
    const ctx = getActiveContext();
    if (ctx) ctx.closePath();
  }, [getActiveContext]);

  const clearCanvas = useCallback(() => {
    const ctx = getActiveContext();
    if (!ctx) return;
    
    // Si c'est le background, on remplit de couleur, sinon on efface (transparence)
    if (selectedLayerId === layers[0].id) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
  }, [backgroundColor, canvasWidth, canvasHeight, getActiveContext, selectedLayerId, layers]);

  useEffect(() => {
    if (shouldClearCanvas) {
      clearCanvas();
      dispatch(resetClearCanvas());
    }
  }, [shouldClearCanvas, clearCanvas, dispatch]);

  return {
    containerRef, // On retourne la ref du conteneur
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
  };
};
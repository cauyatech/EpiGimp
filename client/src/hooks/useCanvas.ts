import { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { resetClearCanvas } from '../store/toolsSlice';

export const useCanvas = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const savedImageData = useRef<ImageData | null>(null);

  const { activeTool, brushSize, color, eraserSize, shouldClearCanvas } = useSelector((state: RootState) => state.tools);
  const { canvasWidth, canvasHeight, backgroundColor } = useSelector((state: RootState) => state.project);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }, [canvasWidth, canvasHeight, backgroundColor]);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawing.current = true;
    lastPos.current = { x, y };
    startPos.current = { x, y };

    if (activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'line') {
      savedImageData.current = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    }

    if (activeTool === 'brush' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }, [activeTool, canvasWidth, canvasHeight]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
      ctx.lineWidth = eraserSize;
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
  }, [activeTool, color, brushSize, eraserSize]);

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
    startPos.current = null;
    savedImageData.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }, [backgroundColor, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (shouldClearCanvas) {
      clearCanvas();
      dispatch(resetClearCanvas());
    }
  }, [shouldClearCanvas, clearCanvas, dispatch]);

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
  };
};

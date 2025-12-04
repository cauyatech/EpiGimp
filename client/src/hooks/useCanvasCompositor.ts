/**
 * useCanvasCompositor.ts
 * Hook pour composer tous les calques en une image finale
 * Fusionne les calques visibles avec leur opacité respective
 */

import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const useCanvasCompositor = () => {
  const { layers } = useSelector((state: RootState) => state.layers);
  const { canvasWidth, canvasHeight } = useSelector((state: RootState) => state.project);

  /**
   * Compose tous les calques en une seule image
   * @returns Base64 data URL de l'image composée
   */
  const composeAllLayers = useCallback((): string | null => {
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = canvasWidth;
    compositeCanvas.height = canvasHeight;
    const compositeCtx = compositeCanvas.getContext('2d');
    
    if (!compositeCtx) return null;

    // Dessiner chaque calque visible dans l'ordre
    layers.forEach((layer) => {
      if (!layer.visible) return;

      const layerCanvas = document.getElementById(layer.id) as HTMLCanvasElement;
      if (!layerCanvas) return;

      // Appliquer l'opacité du calque
      compositeCtx.globalAlpha = layer.opacity;
      compositeCtx.drawImage(layerCanvas, 0, 0);
    });

    // Réinitialiser l'opacité
    compositeCtx.globalAlpha = 1;

    return compositeCanvas.toDataURL('image/png');
  }, [layers, canvasWidth, canvasHeight]);

  /**
   * Exporte l'image composée
   * @param format Format de l'image (png, jpeg, webp)
   * @param quality Qualité pour jpeg/webp (0-1)
   */
  const exportComposedImage = useCallback((
    format: 'png' | 'jpeg' | 'webp' = 'png',
    quality: number = 0.95
  ) => {
    const dataUrl = composeAllLayers();
    if (!dataUrl) return;

    // Créer un lien de téléchargement
    const link = document.createElement('a');
    const mimeType = `image/${format}`;
    
    // Convertir au format souhaité si nécessaire
    if (format !== 'png') {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          link.href = canvas.toDataURL(mimeType, quality);
          link.download = `epigimp-export-${Date.now()}.${format}`;
          link.click();
        }
      };
      img.src = dataUrl;
    } else {
      link.href = dataUrl;
      link.download = `epigimp-export-${Date.now()}.${format}`;
      link.click();
    }
  }, [composeAllLayers, canvasWidth, canvasHeight]);

  /**
   * Copie l'image composée dans le presse-papier
   */
  const copyToClipboard = useCallback(async () => {
    const dataUrl = composeAllLayers();
    if (!dataUrl) return;

    try {
      const blob = await fetch(dataUrl).then(r => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, [composeAllLayers]);

  return {
    composeAllLayers,
    exportComposedImage,
    copyToClipboard,
  };
};

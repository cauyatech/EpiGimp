/**
 * canvasUtils.ts
 * Utilitaires pour la manipulation des canvas
 */

/**
 * Redimensionne un canvas en préservant son contenu
 */
export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  newWidth: number,
  newHeight: number
): void => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) return;
  
  // Copier le contenu actuel
  tempCtx.drawImage(canvas, 0, 0);
  
  // Redimensionner le canvas original
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  // Redessiner le contenu
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(tempCanvas, 0, 0);
  }
};

/**
 * Efface un canvas avec une couleur de fond
 */
export const clearCanvas = (
  canvas: HTMLCanvasElement,
  backgroundColor?: string
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

/**
 * Convertit un canvas en data URL
 */
export const canvasToDataURL = (
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.95
): string => {
  return canvas.toDataURL(`image/${format}`, quality);
};

/**
 * Charge une image dans un canvas
 */
export const loadImageToCanvas = (
  canvas: HTMLCanvasElement,
  imageUrl: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve();
      } else {
        reject(new Error('Cannot get canvas context'));
      }
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

/**
 * Applique un filtre à un canvas
 */
export const applyCanvasFilter = (
  canvas: HTMLCanvasElement,
  filter: string
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.filter = filter;
  ctx.drawImage(canvas, 0, 0);
  ctx.filter = 'none';
};

/**
 * Flip horizontal d'un canvas
 */
export const flipHorizontal = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) return;
  
  tempCtx.drawImage(canvas, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(-1, 1);
  ctx.drawImage(tempCanvas, -canvas.width, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

/**
 * Flip vertical d'un canvas
 */
export const flipVertical = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) return;
  
  tempCtx.drawImage(canvas, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(1, -1);
  ctx.drawImage(tempCanvas, 0, -canvas.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

/**
 * Rotation d'un canvas
 */
export const rotateCanvas = (
  canvas: HTMLCanvasElement,
  degrees: number
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) return;
  
  tempCtx.drawImage(canvas, 0, 0);
  
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  
  const newWidth = Math.abs(canvas.width * cos) + Math.abs(canvas.height * sin);
  const newHeight = Math.abs(canvas.width * sin) + Math.abs(canvas.height * cos);
  
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(tempCanvas, -tempCanvas.width / 2, -tempCanvas.height / 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

/**
 * Calcule la distance entre deux points
 */
export const distance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Lissage de Catmull-Rom pour des courbes douces
 */
export const getCatmullRomPoint = (
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): { x: number; y: number } => {
  const t2 = t * t;
  const t3 = t2 * t;
  
  const v0x = (p2.x - p0.x) * 0.5;
  const v0y = (p2.y - p0.y) * 0.5;
  const v1x = (p3.x - p1.x) * 0.5;
  const v1y = (p3.y - p1.y) * 0.5;
  
  return {
    x: (2 * p1.x - 2 * p2.x + v0x + v1x) * t3 +
       (-3 * p1.x + 3 * p2.x - 2 * v0x - v1x) * t2 +
       v0x * t + p1.x,
    y: (2 * p1.y - 2 * p2.y + v0y + v1y) * t3 +
       (-3 * p1.y + 3 * p2.y - 2 * v0y - v1y) * t2 +
       v0y * t + p1.y
  };
};

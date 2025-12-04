import type { Request, Response } from 'express';
import sharp from 'sharp';

export const applyFilter = async (req: Request, res: Response) => {
  try {
    const { imageData, filterType, options } = req.body;

    if (!imageData || !filterType) {
      return res.status(400).json({ error: 'Missing imageData or filterType' });
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
    
    let processedImage = sharp(imageBuffer);

    // Apply filters based on type
    switch (filterType) {
      case 'blur':
        processedImage = processedImage.blur(options?.sigma || 5);
        break;
      case 'grayscale':
        processedImage = processedImage.grayscale();
        break;
      case 'sharpen':
        processedImage = processedImage.sharpen();
        break;
      case 'rotate':
        processedImage = processedImage.rotate(options?.angle || 90);
        break;
      case 'flip':
        processedImage = processedImage.flip();
        break;
      case 'flop':
        processedImage = processedImage.flop();
        break;
      case 'brightness':
        processedImage = processedImage.modulate({ brightness: options?.value || 1.2 });
        break;
      case 'contrast':
        // Sharp doesn't have direct contrast, use linear for approximation
        processedImage = processedImage.linear(options?.value || 1.2, 0);
        break;
      default:
        return res.status(400).json({ error: 'Unknown filter type' });
    }

    const outputBuffer = await processedImage.png().toBuffer();
    const base64Image = `data:image/png;base64,${outputBuffer.toString('base64')}`;

    res.json({ processedImage: base64Image });
  } catch (error: any) {
    console.error('Filter error:', error);
    res.status(500).json({ error: error.message });
  }
};

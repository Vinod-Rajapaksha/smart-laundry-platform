import { Request, Response } from 'express';
import jsQR from 'jsqr';
import { Jimp } from 'jimp';
import { ApiResponse } from '../../core/apiResponse.js';
import ApiError from '../../core/apiError.js';

export const decodeQrCode = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'Please upload an image');
    }

    const image = await (Jimp as any).read(req.file.buffer);
    const { data, width, height } = image.bitmap;

    const decode = (jsQR as any).default || jsQR;
    const code = decode(new Uint8ClampedArray(data), width, height);

    if (code) {
      return ApiResponse(res, 200, 'QR Code decoded successfully', {
        data: code.data
      });
    } else {
      throw new ApiError(404, 'No QR code found in the image');
    }
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || 'Internal server error');
  }
};

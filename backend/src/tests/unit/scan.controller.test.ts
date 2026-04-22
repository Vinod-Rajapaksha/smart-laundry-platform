import { jest } from '@jest/globals';
import * as scanController from '../../modules/scan/controller.js';
import { Request, Response } from 'express';
import { Jimp } from 'jimp';
import jsQR from 'jsqr';



jest.mock('jsqr', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('Scan Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { file: { buffer: Buffer.from('fake-image') } as any };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as any;
    jest.clearAllMocks();
  });

  it('should throw error if no file uploaded', async () => {
    req.file = undefined;

    await expect(
      scanController.decodeQrCode(req as Request, res as Response)
    ).rejects.toThrow('Please upload an image');
  });

  it('should return decoded data if QR code found', async () => {
    jest.spyOn(Jimp, 'read').mockResolvedValue({
      bitmap: { data: [0], width: 1, height: 1 }
    } as any);

    (jsQR as any).mockReturnValue({ data: 'qr-data' });

    await scanController.decodeQrCode(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'QR Code decoded successfully',
      data: { data: 'qr-data' }
    }));
  });

  it('should throw 404 if no QR code found', async () => {
    jest.spyOn(Jimp, 'read').mockResolvedValue({
      bitmap: { data: [0], width: 1, height: 1 }
    } as any);

    (jsQR as any).mockReturnValue(null);

    await expect(
      scanController.decodeQrCode(req as Request, res as Response)
    ).rejects.toThrow('No QR code found in the image');
  });
});
import { jest } from '@jest/globals';

jest.unstable_mockModule('jsqr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const scanController = await import('../../modules/scan/controller.js');
const { Jimp } = await import('jimp');
const { default: jsQR } = await import('jsqr');

describe('Scan Controller', () => {
  let req: any;
  let res: any;

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
      scanController.decodeQrCode(req, res)
    ).rejects.toThrow('Please upload an image');
  });

  it('should return decoded data if QR code found', async () => {
    jest.spyOn(Jimp, 'read').mockResolvedValue({
      bitmap: { data: [0], width: 1, height: 1 }
    } as any);

    (jsQR as any).mockReturnValue({ data: 'qr-data' });

    await scanController.decodeQrCode(req, res);

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
      scanController.decodeQrCode(req, res)
    ).rejects.toThrow('No QR code found in the image');
  });
});
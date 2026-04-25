process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import { jest } from '@jest/globals';

let request: any;
let app: any;
let Jimp: any;
let jsQR: any;
let testHelpers: any;

describe("Scan Integration Tests", () => {
  beforeAll(async () => {
    request = (await import('supertest')).default;
    const appModule = await import('../../app.js');
    app = appModule.default;
    const jimpModule = await import('jimp');
    Jimp = jimpModule.Jimp;
    jsQR = (await import('jsqr')).default;
    testHelpers = await import('../testHelpers.js');

    await testHelpers.connectTestDB();
  });
  afterAll(async () => { await testHelpers.disconnectTestDB(); });
  afterEach(async () => { await testHelpers.clearTestDB(); });

  describe("POST /api/scan/decode", () => {
    it("should decode QR code from image", async () => {
      const { token } = await testHelpers.createTestUser("STAFF");

      jest.spyOn(Jimp, 'read').mockResolvedValue({
        bitmap: { data: Buffer.from("data"), width: 1, height: 1 }
      } as any);

      const decode = jsQR.default || jsQR;
      jest.spyOn(jsQR, 'default').mockReturnValue({ data: "order-id-123" } as any);

      const res = await request(app)
        .post("/api/scan/decode")
        .set(testHelpers.getAuthHeader(token))
        .attach("image", Buffer.from("fake-image"), "scan.jpg");

      expect(res.status).toBe(200);
      expect(res.body.data.data).toBe("order-id-123");
    });
  });
});

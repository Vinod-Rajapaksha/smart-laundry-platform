import { jest } from '@jest/globals';

jest.unstable_mockModule('jimp', () => ({
  Jimp: {
    read: jest.fn(() => Promise.resolve({
      bitmap: { data: Buffer.from("data"), width: 1, height: 1 }
    }))
  }
}));

jest.unstable_mockModule('jsqr', () => ({
  default: jest.fn(() => ({ data: "order-id-123" }))
}));

let request: any;
let app: any;
let testHelpers: any;

describe("Scan Integration Tests", () => {
  beforeAll(async () => {
    request = (await import('supertest')).default;
    const appModule = await import('../../app.js');
    app = appModule.default;
    testHelpers = await import('../testHelpers.js');

    await testHelpers.connectTestDB();
  });
  afterAll(async () => { await testHelpers.disconnectTestDB(); });
  afterEach(async () => { await testHelpers.clearTestDB(); });

  describe("POST /api/scan/decode", () => {
    it("should decode QR code from image", async () => {
      const { token } = await testHelpers.createTestUser("STAFF");

      const res = await request(app)
        .post("/api/scan/decode")
        .set(testHelpers.getAuthHeader(token))
        .attach("image", Buffer.from("fake-image"), "scan.jpg");

      expect(res.status).toBe(200);
      expect(res.body.data.data).toBe("order-id-123");
    });
  });
});

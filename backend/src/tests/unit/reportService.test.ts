// import { jest } from '@jest/globals';
// import type { Request, Response } from 'express';
// import * as reportGenService from '../../modules/reportGen/reportGenService.js';
// import * as reportGenController from '../../modules/reportGen/reportGenController.js';

// // Mock models and PDFKit with ES module compatibility
// jest.mock('../../database/models/Revenue.js', () => ({
//   __esModule: true,
//   default: { find: jest.fn() },
// }));
// jest.mock('../../database/models/Expense.js', () => ({
//   __esModule: true,
//   default: { find: jest.fn() },
// }));
// jest.mock('../../database/models/Report.js', () => ({
//   __esModule: true,
//   default: {
//     create: jest.fn(),
//     countDocuments: jest.fn(),
//     find: jest.fn(),
//     findById: jest.fn(),
//   },
// }));
// jest.mock('pdfkit', () => ({
//   __esModule: true,
//   default: jest.fn().mockImplementation(() => ({
//     on: jest.fn(),
//     fontSize: jest.fn().mockReturnThis(),
//     text: jest.fn().mockReturnThis(),
//     moveDown: jest.fn().mockReturnThis(),
//     fillColor: jest.fn().mockReturnThis(),
//     end: jest.fn(),
//   })),
// }));

// import RevenueModel from '../../database/models/Revenue.js';
// import ExpenseModel from '../../database/models/Expense.js';
// import ReportModel from '../../database/models/Report.js';
// import PDFDocument from 'pdfkit';

// const mockRes = () => {
//   const res: Partial<Response> = {};
//   res.status = jest.fn().mockReturnThis();
//   res.json = jest.fn().mockReturnThis();
//   res.send = jest.fn().mockReturnThis();
//   res.setHeader = jest.fn().mockReturnThis();
//   res.set = jest.fn().mockReturnThis();
//   return res as Response;
// };

// describe('ReportGen Service', () => {
//   beforeEach(() => jest.clearAllMocks());

//   describe('getReportData', () => {
//     it('should calculate revenue, expense, and net profit', async () => {
//       (RevenueModel.find as jest.Mock).mockReturnValue({
//         sort: jest.fn().mockResolvedValue([
//           { amount: 1000 }, { amount: 2000 },
//         ]),
//       });
//       (ExpenseModel.find as jest.Mock).mockReturnValue({
//         sort: jest.fn().mockResolvedValue([
//           { amount: 500 },
//         ]),
//       });

//       const result = await reportGenService.getReportData({
//         from: '2026-03-01',
//         to: '2026-03-31',
//         fields: ['totalRevenue', 'totalExpense', 'netProfit'],
//       });

//       expect(result.totalRevenue).toBe(3000);
//       expect(result.totalExpense).toBe(500);
//       expect(result.netProfit).toBe(2500);
//     });

//     it('should throw error for invalid date', async () => {
//       await expect(
//         reportGenService.getReportData({
//           from: 'bad',
//           to: 'bad',
//           fields: ['totalRevenue'],
//         })
//       ).rejects.toThrow();
//     });
//   });

//   describe('saveGeneratedReport', () => {
//     it('should save and return the report', async () => {
//       (ReportModel.countDocuments as jest.Mock).mockResolvedValue(5);
//       const mockCreated = { _id: '123', reportCode: 'RI-0006' };
//       (ReportModel.create as jest.Mock).mockResolvedValue(mockCreated);

//       const result = await reportGenService.saveGeneratedReport({
//         from: '2026-03-01',
//         to: '2026-03-31',
//         selectedSections: ['totalRevenue'],
//         reportData: { totalRevenue: 3000 },
//         generatedByName: 'Admin',
//       });

//       expect(result).toEqual(mockCreated);
//     });

//     it('should throw error if create fails', async () => {
//       (ReportModel.countDocuments as jest.Mock).mockResolvedValue(5);
//       (ReportModel.create as jest.Mock).mockRejectedValue(new Error('DB error'));
//       await expect(
//         reportGenService.saveGeneratedReport({
//           from: '2026-03-01',
//           to: '2026-03-31',
//           selectedSections: [],
//           reportData: {},
//         })
//       ).rejects.toThrow('DB error');
//     });
//   });

//   describe('buildReportPdfBuffer', () => {
//     it('should resolve with a Buffer', async () => {
//       const buffer = await reportGenService.buildReportPdfBuffer({
//         reportData: { totalRevenue: 1000, totalExpense: 500, netProfit: 500 },
//         reportCode: 'RI-0001',
//         generatedByName: 'Admin',
//         createdAt: new Date(),
//         periodFrom: new Date(),
//         periodTo: new Date(),
//         selectedSections: [],
//       });
//       expect(Buffer.isBuffer(buffer)).toBe(true);
//     });

//     it('should reject on PDF error', async () => {
//       (PDFDocument as unknown as jest.Mock).mockImplementationOnce(() => {
//         throw new Error('PDF error');
//       });
//       await expect(
//         reportGenService.buildReportPdfBuffer({ reportData: {} })
//       ).rejects.toThrow('PDF error');
//     });
//   });
// });

// describe('ReportGen Controller', () => {
//   beforeEach(() => jest.clearAllMocks());

//   it('should generate report and return success', async () => {
//     const req = {
//       body: {
//         dateRange: { from: '2026-03-01', to: '2026-03-31' },
//         filters: { sections: ['Total Revenue'] },
//       },
//       user: { id: 'admin-id' },
//     } as any;
//     const res = mockRes();

//     jest.spyOn(reportGenService, 'getReportData').mockResolvedValue({ totalRevenue: 100 });
//     jest.spyOn(reportGenService, 'saveGeneratedReport').mockResolvedValue({
//       id: 'id1',
//       reportCode: 'RI-0001',
//       generatedByName: 'admin-id',
//       generatedDate: '2026-03-31T00:00:00.000Z',
//     });

//     await reportGenController.generateReport(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       data: { totalRevenue: 100 },
//       report: {
//         id: 'id1',
//         reportCode: 'RI-0001',
//         generatedByName: 'admin-id',
//         generatedDate: '2026-03-31T00:00:00.000Z',
//       },
//     });
//   });

//   it('should handle error and return 500', async () => {
//     const req = {
//       body: {
//         dateRange: { from: 'bad', to: 'bad' },
//         filters: { sections: ['Total Revenue'] },
//       },
//       user: { id: 'admin-id' },
//     } as any;
//     const res = mockRes();

//     jest.spyOn(reportGenService, 'getReportData').mockRejectedValue(new Error('Service error'));

//     await reportGenController.generateReport(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Service error' });
//   });
// });


import { jest } from "@jest/globals";

const mockRevenueFind = jest.fn();
const mockExpenseFind = jest.fn();

jest.unstable_mockModule("../../database/models/Revenue.ts", () => ({
	default: {
		find: mockRevenueFind,
	},
}));

jest.unstable_mockModule("../../database/models/Expense.ts", () => ({
	default: {
		find: mockExpenseFind,
	},
}));

const { getFinanceSummary } = await import("../../modules/finance/service.js");

describe("getFinanceSummary", () => {

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("calculates totals correctly", async () => {

	
		mockRevenueFind.mockReturnValue({
			sort: jest
				.fn<() => Promise<{ amount: number; date: Date }[]>>()
				.mockResolvedValue([
					{ amount: 1000, date: new Date() },
				]),
		});

		mockExpenseFind.mockReturnValue({
			sort: jest
				.fn<() => Promise<{ amount: number; date: Date }[]>>()
				.mockResolvedValue([
					{ amount: 300, date: new Date() },
				]),
		});

		const result = await getFinanceSummary();

		expect(result.totalRevenue).toBe(1000);
		expect(result.totalExpense).toBe(300);
		expect(result.netProfit).toBe(700);
	});

});

export const getFinanceSummary = async (req: Request, res: Response) => {
  try {
    const summary = await financeService.getFinanceSummary();
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getAllRevenues = async (req: Request, res: Response) => {
  try {
    const revenues = await financeService.getAllRevenues();
    res.status(200).json({ success: true, data: revenues });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await financeService.getAllExpenses();
    res.status(200).json({ success: true, data: expenses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import { Request, Response } from 'express';
import * as financeService from './financeService.js';

export const addRevenue = async (req: Request, res: Response) => {
  try {
    const { date, name, amount } = req.body;
    const revenue = await financeService.addRevenue({ date, name, amount });
    res.status(201).json({ success: true, data: revenue });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addExpense = async (req: Request, res: Response) => {
  try {
    const { date, name, amount } = req.body;
    const expense = await financeService.addExpense({ date, name, amount });
    res.status(201).json({ success: true, data: expense });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

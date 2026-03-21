import { body } from 'express-validator';

export const financeEntryValidation = [
  body('date').isISO8601().withMessage('Date is required and must be valid.'),
  body('name').isString().notEmpty().withMessage('Name is required.'),
  body('amount').isNumeric().withMessage('Amount must be a number.'),
];

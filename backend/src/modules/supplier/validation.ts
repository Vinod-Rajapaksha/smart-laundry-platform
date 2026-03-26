import Joi from 'joi';

export const createSupplierSchema = Joi.object({
  name: Joi.string().required(),
  contactPerson: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  status: Joi.string().valid('Active', 'Inactive').optional(),
});

export const updateSupplierSchema = Joi.object({
  name: Joi.string(),
  contactPerson: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  address: Joi.string(),
  status: Joi.string().valid('Active', 'Inactive'),
});

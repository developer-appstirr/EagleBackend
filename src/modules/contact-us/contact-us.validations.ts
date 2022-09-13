import { Joi } from 'express-validation';

/**
 * Add Contact us route validation
 */
const addContactUsValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

/**
 * Get all contact us route validation
 */
const getAllContactUsValidation = {
  query: Joi.object({
    page: Joi.number(),
    limit: Joi.number(),
  }),
};

/**
 * Export all
 */
export = {
  addContactUsValidation,
  getAllContactUsValidation,
};

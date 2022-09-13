import { Joi } from 'express-validation';

/**
 * Add FAQ route validation
 */
const addFAQValidation = {
  body: Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
  }),
};

/**
 * Update FAQ route validation
 */
const updateFAQValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
  }),
};

/**
 * Get all FAQ's route validation
 */
const getAllFAQsValidation = {
  query: Joi.object({
    page: Joi.number(),
    limit: Joi.number(),
  }),
};

/**
 * Delete FAQ route validation
 */
const idParamValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

/**
 * Export all
 */
export = {
  idParamValidation,
  addFAQValidation,
  updateFAQValidation,
  getAllFAQsValidation,
};

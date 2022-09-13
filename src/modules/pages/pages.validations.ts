import { Joi } from 'express-validation';
import PageTypesEnum from './models/page-types.enum';

/**
 * Update Page route validation
 */
const updatePageValidation = {
  params: Joi.object({
    pageType: Joi.string()
      .valid(...Object.keys(PageTypesEnum))
      .required(),
  }),
  body: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

/**
 * Get all pages route validation
 */
const getAllPagesValidation = {
  query: Joi.object({
    page: Joi.number(),
    limit: Joi.number(),
  }),
};

/**
 * Export all
 */
export = {
  updatePageValidation,
  getAllPagesValidation,
};

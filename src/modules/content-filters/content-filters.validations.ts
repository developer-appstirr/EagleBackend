import { Joi } from 'express-validation';

/**
 * Add content filter route validation
 */
const addContentFilterValidation = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

/**
 * Update content filter route validation
 */
const updateContentFilterValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

/**
 * Delete content filter route validation
 */
const idParamValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

/**
 * Update parent content filter status alert route validation
 */
const updateParentContentFilterValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    status: Joi.boolean().required(),
    alert: Joi.boolean().required(),
  }),
};

/**
 * Export all
 */
export = {
  addContentFilterValidation,
  idParamValidation,
  updateContentFilterValidation,
  updateParentContentFilterValidation,
};

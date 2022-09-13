import { Joi } from 'express-validation';

/**
 * Update App filter route validation
 */
const updateAppFilterValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    isActive: Joi.boolean().required(),
  }),
};

/**
 * Export all
 */
export = {
  updateAppFilterValidation,
};

import { Joi } from 'express-validation';

/**
 * Application link send to device route validation
 */
const sendApplicationLinkValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

/**
 * Get all devices route validatioj
 */
const childrenIdParamValidation = {
  params: Joi.object({
    childrenId: Joi.string().uuid().required(),
  }),
};
/**
 * Delete device route validation
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
  sendApplicationLinkValidation,
  childrenIdParamValidation,
  idParamValidation,
};

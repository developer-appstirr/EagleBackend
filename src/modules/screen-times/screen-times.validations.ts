import { Joi } from 'express-validation';

/**
 * Add screen time route validation
 */
const addScreenTimeValidation = {
  body: Joi.object({
    rulename: Joi.string().required(),
    from: Joi.required(),
    to: Joi.required(),
  }),
};

/**
 * Update screen time route validation
 */
const updateScreenTimeValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    rulename: Joi.string().required(),
    from: Joi.required(),
    to: Joi.required(),
  }),
};

/**
 * Update and save screen time for children route validation
 */
const addAndUpdateScreenTimeForChildrenValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    childrenId: Joi.string().uuid().required(),
  }),
};

/**
 * get screen time for children route validation
 */
const getScreenTimeForChildrenValidation = {
  params: Joi.object({
    childrenId: Joi.string().uuid().required(),
  }),
};

/**
 * Delete screen time route validation
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
  addScreenTimeValidation,
  idParamValidation,
  updateScreenTimeValidation,
  addAndUpdateScreenTimeForChildrenValidation,
  getScreenTimeForChildrenValidation,
};

import { Joi } from 'express-validation';
import SubscriptionTypesEnum from '../subscriptions/models/subscription-types.enum';

/**
 * Update profile detail route validation
 */
const updateProfileValidation = {
  body: Joi.object({
    fullname: Joi.string().required(),
    phone: Joi.string().required(),
  }),
};

/**
 * Update account setting route validation
 */
const updateAccountSettingValidation = {
  body: Joi.object({
    notification: Joi.boolean().required(),
  }),
};

/**
 * Update device token route validation
 */
const updateDeviceTokenValidation = {
  body: Joi.object({
    deviceToken: Joi.string().required(),
  }),
};

/**
 * Change password detail route validation
 */
const changePasswordValidation = {
  body: Joi.object({
    password: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  }),
};

/**
 * Get all user management route validation
 */
const getAllUsersManagementValidation = {
  query: Joi.object({
    subscription: Joi.string().valid(...Object.keys(SubscriptionTypesEnum), 'EXPIRED'),
    dateFrom: Joi.date().min('1900-01-01'),
    dateTo: Joi.date().min('1900-01-01'),
    search: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
    pagination: Joi.string(),
  }),
};

/**
 * Export all
 */
export = {
  updateProfileValidation,
  changePasswordValidation,
  updateAccountSettingValidation,
  updateDeviceTokenValidation,
  getAllUsersManagementValidation,
};

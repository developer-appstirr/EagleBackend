import { Joi } from 'express-validation';
import SubscriptionTypesEnum from './models/subscription-types.enum';

/**
 * Add subscription route validation
 */
const addSubscriptionValidation = {
  body: Joi.object({
    subscriptionType: Joi.string()
      .valid(...Object.keys(SubscriptionTypesEnum))
      .required(),
    title: Joi.string().required(),
    subTitle: Joi.string().required(),
    description: Joi.string().required(),
    deviceLimit: Joi.number().required(),
    price: Joi.number().required(),
  }),
};

/**
 * Update subscription route validation
 */
const updateSubscriptionValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    subscriptionType: Joi.string()
      .valid(...Object.keys(SubscriptionTypesEnum))
      .required(),
    title: Joi.string().required(),
    subTitle: Joi.string().required(),
    description: Joi.string().required(),
    deviceLimit: Joi.number().required(),
    price: Joi.number().required(),
  }),
};

/**
 * Delete subscription route validation
 */
const idParamValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

/**
 * buy subscription route validation
 */
const buySubscriptionValidation = {
  body: Joi.object({
    subscriptionId: Joi.string().uuid().required(),
    deviceIds: Joi.array().items(Joi.string()).optional(),
  }),
};

/**
 * Export all
 */
export = {
  addSubscriptionValidation,
  updateSubscriptionValidation,
  idParamValidation,
  buySubscriptionValidation,
};

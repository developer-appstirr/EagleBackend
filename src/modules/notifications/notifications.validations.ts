import { Joi } from 'express-validation';
import SubscriptionTypesEnum from '../subscriptions/models/subscription-types.enum';

/**
 * Send notifications route validation
 */
const sendNotifications = {
  body: Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    subscription: Joi.string().valid(...Object.keys(SubscriptionTypesEnum), 'EXPIRED'),
    dateFrom: Joi.date().min('1900-01-01'),
    dateTo: Joi.date().min('1900-01-01'),
    search: Joi.string(),
  }),
};
/**
 * Get all notification route validation
 */
const getAllNotificationsValidation = {
  query: Joi.object({
    page: Joi.number(),
    limit: Joi.number(),
  }),
};
/**
 * Export all
 */
export = {
  sendNotifications,
  getAllNotificationsValidation,
};

import { Joi } from 'express-validation';

/**
 * Get all chats route validation
 */
const getAllChatsValidation = {
  query: Joi.object({
    userId: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
  }),
};

/**
 * Get all chat heads route validation
 */
const getAllChatHeadsValidation = {
  query: Joi.object({
    search: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
  }),
};

/**
 * Export all
 */
export = {
  getAllChatsValidation,
  getAllChatHeadsValidation,
};

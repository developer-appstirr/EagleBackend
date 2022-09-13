import { Joi } from 'express-validation';
import LoginTypesEnum from '../users/models/login-type.enum';

/**
 * Signup route validation
 */
const signUpValidation = {
  body: Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
  }),
};

/**
 * Social login route validation
 */
const socialLoginValidation = {
  body: Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    loginType: Joi.string()
      .valid(...Object.keys(LoginTypesEnum))
      .required(),
  }),
};

/**
 * account verification email and code validation
 */
const verifyAccountValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.number().required(),
  }),
};

/**
 * Login route validation
 */
const signInValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

/**
 * Resend account verification email validation
 */
const resendVerificationValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

/**
 * forgot password request email validation
 */
const forgotPasswordValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

/**
 * verify forgot password email and code validation
 */
const verifyForgotPasswordValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.number().required(),
  }),
};

/**
 * change password token and password validation
 */
const changePasswordValidation = {
  query: Joi.object({
    token: Joi.string().required(),
  }),
  body: Joi.object({
    password: Joi.string().min(6).required(),
  }),
};

/**
 * update device token validation
 */
const updateDeviceTokenValidation = {
  body: Joi.object({
    deviceToken: Joi.string().required(),
  }),
};

/**
 * Export all
 */
export = {
  signUpValidation,
  socialLoginValidation,
  signInValidation,
  resendVerificationValidation,
  verifyAccountValidation,
  forgotPasswordValidation,
  verifyForgotPasswordValidation,
  changePasswordValidation,
  updateDeviceTokenValidation,
};

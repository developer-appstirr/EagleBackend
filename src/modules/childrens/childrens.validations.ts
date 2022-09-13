import { Joi } from 'express-validation';
import DeviceTypeEnum from '../devices/models/device-type.enum';

/**
 * Add children route validation
 */
const addChildrenValidation = {
  body: Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    dateOfBirth: Joi.date().required(),
    qrCode: Joi.string().base64().required(),
  }),
};

/**
 * Update children route validation
 */
const updateChildrenValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().min(6),
    dateOfBirth: Joi.date().required(),
    qrCode: Joi.string().base64().required(),
  }),
};

/**
 * Update children profile image route validation
 * Update children profile route validation
 */
const idParamValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

/**
 * SignIn children route validation
 */
const signInChildrenValidation = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    deviceName: Joi.string().required(),
    deviceType: Joi.string()
      .valid(...Object.keys(DeviceTypeEnum))
      .required(),
    imeiNumber: Joi.string().required(),
    version: Joi.string().required(),
  }),
};

/**
 * Update profile detail route validation
 */
const updateChildrenProfileValidation = {
  body: Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
  }),
};

/**
 * Export all
 */
export = {
  addChildrenValidation,
  idParamValidation,
  updateChildrenValidation,
  signInChildrenValidation,
  updateChildrenProfileValidation,
};

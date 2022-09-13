import { Router } from 'express';
import validate from '../../middlewares/validate.middleware';

import roleAccess from '../../middlewares/roleAccess.middleware';
import fileUpload from '../../middlewares/fileUpload.middleware';
import UsersController from './users.controller';
import validations from './users.validations';
import RoleEnum from '../roles/models/roles.enum';

const {
  updateProfileValidation,
  changePasswordValidation,
  updateAccountSettingValidation,
  updateDeviceTokenValidation,
  getAllUsersManagementValidation,
} = validations;

const router = Router();

const controller = new UsersController();

/**
 * @swagger
 * tags:
 *   name: Users
 */

/**
 * @swagger
 * /users/update-profile:
 *   post:
 *     tags:
 *       - Users
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: The user's name.
 *                 example: Osama bin laden
 *               phone:
 *                 type: string
 *                 description: The user's password.
 *                 example: +9230000000
 */
router.post(
  '/update-profile',
  roleAccess([RoleEnum.PARENT, RoleEnum.ADMIN]),
  validate(updateProfileValidation),
  controller.updateProfile,
);

/**
 * @swagger
 * /users/profile-image:
 *   post:
 *     tags:
 *       - Users
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     consumes:
 *        - multipart/form-data
 *     parameters:
 *        - in: formData
 *          name: file
 *          schema:
 *           type: file
 *          description: The file to upload
 *          required: true
 *
 */
router.post('/profile-image', roleAccess([RoleEnum.PARENT]), fileUpload(), controller.updateProfileImage);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     tags:
 *       - Users
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The user's old password.
 *                 example: ~!ab12
 *               newPassword:
 *                 type: string
 *                 description: The user's new password.
 *                 example: ~!ab12
 */
router.post(
  '/change-password',
  roleAccess([RoleEnum.PARENT, RoleEnum.ADMIN]),
  validate(changePasswordValidation),
  controller.changePassword,
);

/**
 * @swagger
 * /users/account-setting:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/account-setting', roleAccess([RoleEnum.PARENT]), controller.accountSetting);

/**
 * @swagger
 * /users/account-setting:
 *   post:
 *     tags:
 *       - Users
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notification:
 *                 type: boolean
 *                 example: true
 */
router.post(
  '/account-setting',
  roleAccess([RoleEnum.PARENT]),
  validate(updateAccountSettingValidation),
  controller.updateAccountSetting,
);

/**
 * @swagger
 * /users/device-token:
 *   put:
 *     tags:
 *       - Users
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceToken:
 *                 type: string
 *                 example: string
 */
router.put(
  '/device-token',
  roleAccess([RoleEnum.PARENT]),
  validate(updateDeviceTokenValidation),
  controller.updateDeviceToken,
);

/**
 * @swagger
 * /users/management:
 *   get:
 *     tags:
 *       - Users
 *     parameters:
 *      - in: query
 *        name: subscription
 *        schema:
 *        type: string
 *        enum: [ "MONTHLY", "YEARLY", "EXPIRED"]
 *        example: MONTHLY
 *      - in: query
 *        name: search
 *        schema:
 *        type: string
 *      - in: query
 *        name: limit
 *        schema:
 *        type: number
 *      - in: query
 *        name: page
 *        schema:
 *        type: number
 *      - in: query
 *        name: dateFrom
 *        example: 2021-11-30
 *        schema:
 *        type: date
 *      - in: query
 *        name: dateTo
 *        example: 2021-11-30
 *        schema:
 *        type: date
 *      - in: query
 *        name: pagination
 *        example: true
 *        schema:
 *        type: boolean
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get(
  '/management',
  roleAccess([RoleEnum.ADMIN]),
  validate(getAllUsersManagementValidation),
  controller.findAllUserManagement,
);

export default router;

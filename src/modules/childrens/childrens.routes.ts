import { Router } from 'express';
import validate from '../../middlewares/validate.middleware';

import roleAccess from '../../middlewares/roleAccess.middleware';
import fileUpload from '../../middlewares/fileUpload.middleware';
import ChildrensController from './childrens.controller';
import validations from './childrens.validations';
import RoleEnum from '../roles/models/roles.enum';
import authenticate from '../../middlewares/auth.middleware';
import subscriptionMiddleware from '../../middlewares/subscription.middleware';

const {
  addChildrenValidation,
  updateChildrenValidation,
  idParamValidation,
  signInChildrenValidation,
  updateChildrenProfileValidation,
} = validations;

const router = Router();

const controller = new ChildrensController();

/**
 * @swagger
 * tags:
 *   name: Childrens
 */

/**
 * @swagger
 * /childrens:
 *   get:
 *     tags:
 *       - Childrens
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/', authenticate, subscriptionMiddleware, roleAccess([RoleEnum.PARENT]), controller.getAllChildren);

/**
 * @swagger
 * /childrens/add:
 *   post:
 *     tags:
 *       - Childrens
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
 *               firstname:
 *                 type: string
 *                 example: Osama
 *               lastname:
 *                 type: string
 *                 example: Ahmed
 *               username:
 *                 type: string
 *                 example: osamaahmed123
 *               password:
 *                 type: string
 *                 example: osamaahmed123
 *               dateOfBirth:
 *                 type: string
 *                 example: 2021-10-13
 *               qrCode:
 *                 type: string
 */
router.post(
  '/add',
  authenticate,
  subscriptionMiddleware,
  roleAccess([RoleEnum.PARENT]),
  validate(addChildrenValidation),
  controller.addChildren,
);

/**
 * @swagger
 * /childrens/{id}/profile-image:
 *   post:
 *     tags:
 *       - Childrens
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     consumes:
 *        - multipart/form-data
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *           type: string
 *           format: uuid
 *        - in: formData
 *          name: file
 *          schema:
 *           type: file
 *           description: The file to upload
 *          required: true
 *
 *
 */
router.post(
  '/:id/profile-image',
  authenticate,
  subscriptionMiddleware,
  roleAccess([RoleEnum.PARENT, RoleEnum.ADMIN]),
  validate(idParamValidation),
  fileUpload(),
  controller.childrenUpdateImage,
);

/**
 * @swagger
 * /childrens/{id}:
 *   put:
 *     tags:
 *       - Childrens
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: Osama
 *               lastname:
 *                 type: string
 *                 example: Ahmed
 *               password:
 *                 type: string
 *                 example: osamaahmed123
 *               dateOfBirth:
 *                 type: string
 *                 example: 2021-10-13
 *               qrCode:
 *                 type: string
 */
router.put(
  '/:id',
  authenticate,
  subscriptionMiddleware,
  roleAccess([RoleEnum.PARENT, RoleEnum.ADMIN]),
  validate(updateChildrenValidation),
  controller.updateChildren,
);

/**
 * @swagger
 * /childrens/{id}:
 *   delete:
 *     tags:
 *       - Childrens
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          type: string
 *          format: uuid
 */
router.delete(
  '/:id',
  authenticate,
  subscriptionMiddleware,
  roleAccess([RoleEnum.PARENT, RoleEnum.ADMIN]),
  validate(idParamValidation),
  controller.deleteChildren,
);

/**
 * @swagger
 * /childrens/auth/signIn:
 *   post:
 *     tags:
 *       - Childrens
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
 *               username:
 *                 type: string
 *                 example: osamaahmed123
 *               password:
 *                 type: string
 *                 example: osamaahmed123
 *               deviceName:
 *                 type: string
 *                 example: Sumsung Note 10
 *               deviceType:
 *                 type: string
 *                 example: ANDROID
 *               imeiNumber:
 *                 type: string
 *                 example: 812348123481234
 *               version:
 *                 type: string
 *                 example: 10.00
 */
router.post('/auth/signIn', validate(signInChildrenValidation), controller.signInChildren);

/**
 * @swagger
 * /childrens/update-profile:
 *   post:
 *     tags:
 *       - Childrens
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
 *               firstname:
 *                 type: string
 *                 example: Osama
 *               lastname:
 *                 type: string
 *                 example: Ahmed
 *               dateOfBirth:
 *                 type: string
 *                 example: 2021-10-13
 */
router.post(
  '/update-profile',
  authenticate,
  subscriptionMiddleware,
  roleAccess([RoleEnum.CHILDREN]),
  validate(updateChildrenProfileValidation),
  controller.updateChildrenProfile,
);

/**
 * @swagger
 * /childrens/profile-image:
 *   post:
 *     tags:
 *       - Childrens
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
 *           description: The file to upload
 *          required: true
 *
 */
router.post(
  '/profile-image',
  authenticate,
  subscriptionMiddleware,
  roleAccess([RoleEnum.CHILDREN]),
  fileUpload(),
  controller.updateChildrenProfileImage,
);

export default router;

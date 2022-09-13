import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import validate from '../../middlewares/validate.middleware';
import RoleEnum from '../roles/models/roles.enum';
import PagesController from './pages.controller';
import validations from './pages.validations';
import authenticate from '../../middlewares/auth.middleware';
import subscriptionMiddleware from '../../middlewares/subscription.middleware';

const { updatePageValidation, getAllPagesValidation } = validations;

const router = Router();

const controller = new PagesController();

/**
 * @swagger
 * tags:
 *   name: Pages
 */

/**
 * @swagger
 * /pages/{pageType}:
 *   get:
 *     tags:
 *       - Pages
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     parameters:
 *      - in: path
 *        name: pageType
 *        required: true
 *        schema:
 *          type: string
 *          enum: [ "PRIVACY_POLICY", "TERM_CONDITIONS", "ABOUT_US"]
 *          example: ABOUT_US
 */
router.get(
  '/:pageType',
  roleAccess([RoleEnum.ADMIN, RoleEnum.PARENT]),
  validate(getAllPagesValidation),
  controller.getPage,
);

/**
 * @swagger
 * /pages/{pageType}:
 *   put:
 *     tags:
 *       - Pages
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     parameters:
 *      - in: path
 *        name: pageType
 *        required: true
 *        schema:
 *          type: string
 *          enum: [ "PRIVACY_POLICY", "TERM_CONDITIONS", "ABOUT_US"]
 *          example: ABOUT_US
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              title:
 *                type: string
 *                example: title
 *              content:
 *                type: string
 *                example: content
 *
 */
router.put('/:pageType', roleAccess([RoleEnum.ADMIN]), validate(updatePageValidation), controller.updatePage);

export default router;

import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import validate from '../../middlewares/validate.middleware';
import RoleEnum from '../roles/models/roles.enum';
import ContactUsController from './contact-us.controller';
import validations from './contact-us.validations';
import authenticate from '../../middlewares/auth.middleware';
import subscriptionMiddleware from '../../middlewares/subscription.middleware';

const { addContactUsValidation, getAllContactUsValidation } = validations;

const router = Router();

const controller = new ContactUsController();

/**
 * @swagger
 * tags:
 *   name: ContactUs
 */

/**
 * @swagger
 * /contact-us:
 *   get:
 *     tags:
 *       - ContactUs
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/', roleAccess([RoleEnum.ADMIN]), validate(getAllContactUsValidation), controller.getAllContactUs);

/**
 * @swagger
 * /contact-us:
 *   post:
 *     tags:
 *       - ContactUs
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
 *              email:
 *                type: string
 *                description: The user's email.
 *                example: osama@gmail.com
 *              phone:
 *                type: string
 *                example: phone
 *              subject:
 *                type: string
 *                example: subject
 *              message:
 *                type: string
 *                example: message
 *
 */
router.post(
  '/',
  authenticate,
  subscriptionMiddleware,
  roleAccess([RoleEnum.PARENT]),
  validate(addContactUsValidation),
  controller.createContactUs,
);

export default router;

import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import validate from '../../middlewares/validate.middleware';
import RoleEnum from '../roles/models/roles.enum';
import FAQsController from './faqs.controller';
import validations from './faqs.validations';
import authenticate from '../../middlewares/auth.middleware';
import subscriptionMiddleware from '../../middlewares/subscription.middleware';

const { updateFAQValidation, getAllFAQsValidation, addFAQValidation, idParamValidation } = validations;

const router = Router();

const controller = new FAQsController();

/**
 * @swagger
 * tags:
 *   name: FAQs
 */

/**
 * @swagger
 * /faqs:
 *   get:
 *     tags:
 *       - FAQs
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/', roleAccess([RoleEnum.ADMIN, RoleEnum.PARENT]), validate(getAllFAQsValidation), controller.getAllFaqs);

/**
 * @swagger
 * /faqs:
 *   post:
 *     tags:
 *       - FAQs
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
 *              question:
 *                type: string
 *                example: question
 *              answer:
 *                type: string
 *                example: answer
 */
router.post('/', authenticate, roleAccess([RoleEnum.ADMIN]), validate(addFAQValidation), controller.addFaq);

/**
 * @swagger
 * /faqs/{id}:
 *   put:
 *     tags:
 *       - FAQs
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
 *              question:
 *                type: string
 *                example: question
 *              answer:
 *                type: string
 *                example: answer
 *
 */
router.put(
  '/:id',
  authenticate,
  subscriptionMiddleware,
  roleAccess([RoleEnum.ADMIN]),
  validate(updateFAQValidation),
  controller.updateFaq,
);

/**
 * @swagger
 * /faqs/{id}:
 *   delete:
 *     tags:
 *       - FAQs
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
router.delete('/:id', authenticate, roleAccess([RoleEnum.ADMIN]), validate(idParamValidation), controller.deleteFaq);

export default router;

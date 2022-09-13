import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import validate from '../../middlewares/validate.middleware';
import RoleEnum from '../roles/models/roles.enum';
import SubscriptionsController from './subscriptions.controller';
import validations from './subscriptions.validations';
import authenticate from '../../middlewares/auth.middleware';
import subscriptionMiddleware from '../../middlewares/subscription.middleware';

const { addSubscriptionValidation, updateSubscriptionValidation, idParamValidation, buySubscriptionValidation } =
  validations;

const router = Router();

const controller = new SubscriptionsController();

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 */

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     tags:
 *       - Subscriptions
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/', controller.getAllSubscriptions);

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     tags:
 *       - Subscriptions
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
 *              subscriptionType:
 *                type: string
 *                enum: [ "MONTHLY", "YEARLY"]
 *                example: MONTHLY
 *              title:
 *                type: string
 *                example: Title
 *              subTitle:
 *                type: string
 *                example: Sub Title
 *              description:
 *                type: string
 *                example: Description
 *              deviceLimit:
 *                type: number
 *                example: 10
 *              price:
 *                type: number
 *                example: 10.12
 *
 */
router.post(
  '/',
  authenticate,
  roleAccess([RoleEnum.ADMIN]),
  validate(addSubscriptionValidation),
  controller.addSubscription,
);

/**
 * @swagger
 * /subscriptions/{id}:
 *   put:
 *     tags:
 *       - Subscriptions
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
 *              subscriptionType:
 *                type: string
 *                enum: [ "MONTHLY", "YEARLY"]
 *                example: MONTHLY
 *              title:
 *                type: string
 *                example: Title
 *              subTitle:
 *                type: string
 *                example: Sub Title
 *              description:
 *                type: string
 *                example: Description
 *              deviceLimit:
 *                type: number
 *                example: 10
 *              price:
 *                type: number
 *                example: 10.12
 */
router.put(
  '/:id',
  authenticate,
  roleAccess([RoleEnum.ADMIN]),
  validate(updateSubscriptionValidation),
  controller.updateSubscription,
);

/**
 * @swagger
 * /subscriptions/{id}:
 *   delete:
 *     tags:
 *       - Subscriptions
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
  roleAccess([RoleEnum.ADMIN]),
  validate(idParamValidation),
  controller.deleteSubscription,
);

/**
 * @swagger
 * /subscriptions/buy-subscription:
 *   post:
 *     tags:
 *       - Subscriptions
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
 *               subscriptionId:
 *                type: string
 *                format: uuid
 *               deviceIds:
 *                type: array
 *                format: uuid
 *                items:
 *                  type: string
 */
router.post(
  '/buy-subscription',
  authenticate,
  roleAccess([RoleEnum.PARENT]),
  validate(buySubscriptionValidation),
  controller.buySubscription,
);

/**
 * @swagger
 * /subscriptions/histories:
 *   get:
 *     tags:
 *       - Subscriptions
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get(
  '/histories',
  authenticate,
  subscriptionMiddleware,
  roleAccess([RoleEnum.PARENT]),
  controller.getAllSubscriptionHistories,
);

export default router;

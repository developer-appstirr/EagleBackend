import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import validate from '../../middlewares/validate.middleware';
import RoleEnum from '../roles/models/roles.enum';
import NotificationsController from './notifications.controller';
import notificationsValidations from './notifications.validations';

const { sendNotifications, getAllNotificationsValidation } = notificationsValidations;
const router = Router();

const controller = new NotificationsController();

/**
 * @swagger
 * tags:
 *   name: Notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *        type: number
 *      - in: query
 *        name: page
 *        schema:
 *        type: number
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/', roleAccess([RoleEnum.PARENT]), validate(getAllNotificationsValidation), controller.getAllNotifications);

/**
 * @swagger
 * /notifications/global-notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *        type: number
 *      - in: query
 *        name: page
 *        schema:
 *        type: number
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get(
  '/global-notifications',
  roleAccess([RoleEnum.ADMIN]),
  validate(getAllNotificationsValidation),
  controller.getGlobalNotifications,
);

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     tags:
 *       - Notifications
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/unread-count', roleAccess([RoleEnum.PARENT]), controller.getAllNotifications);

/**
 * @swagger
 * /notifications/send-notifications:
 *   post:
 *     tags:
 *       - Notifications
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
 *              title:
 *                type: string
 *                example: Title
 *              body:
 *                type: string
 *                example: body
 *              subscription:
 *                 type: string
 *                 enum: [ "MONTHLY","YEARLY", "EXPIRED"]
 *              search:
 *                type: string
 *                example: search
 *              dateFrom:
 *                type: date
 *                example: 2021-11-30
 *              dateTo:
 *                type: date
 *                example: 2021-11-30
 */
router.post(
  '/send-notifications',
  roleAccess([RoleEnum.ADMIN]),
  validate(sendNotifications),
  controller.sendNotification,
);

export default router;

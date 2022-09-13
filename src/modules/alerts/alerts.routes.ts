import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import RoleEnum from '../roles/models/roles.enum';
import AlertsController from './alerts.controller';

const router = Router();

const controller = new AlertsController();

/**
 * @swagger
 * tags:
 *   name: Alerts
 */

/**
 * @swagger
 * /alerts:
 *   get:
 *     tags:
 *       - Alerts
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
router.get('/', roleAccess([RoleEnum.PARENT]), controller.getAllAlerts);

/**
 * @swagger
 * /alerts/unread-count:
 *   get:
 *     tags:
 *       - Alerts
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/unread-count', roleAccess([RoleEnum.PARENT]), controller.getAlertUnReadCount);

export default router;

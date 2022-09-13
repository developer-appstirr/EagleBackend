import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import RoleEnum from '../roles/models/roles.enum';
import AdminController from './admin.controller';

const router = Router();

const controller = new AdminController();

/**
 * @swagger
 * tags:
 *   name: Admin
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/dashboard', roleAccess([RoleEnum.ADMIN]), controller.getDashboard);

export default router;

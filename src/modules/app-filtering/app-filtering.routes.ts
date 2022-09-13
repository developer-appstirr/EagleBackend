import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import validate from '../../middlewares/validate.middleware';
import RoleEnum from '../roles/models/roles.enum';
import PagesController from './app-filtering.controller';
import validations from './app-filtering.validations';

const { updateAppFilterValidation } = validations;

const router = Router();

const controller = new PagesController();

/**
 * @swagger
 * tags:
 *   name: AppFiltering
 */

/**
 * @swagger
 * /app-filtering:
 *   get:
 *     tags:
 *       - AppFiltering
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/', roleAccess([RoleEnum.ADMIN, RoleEnum.PARENT]), controller.getAll);

/**
 * @swagger
 * /app-filtering/{id}:
 *   put:
 *     tags:
 *       - AppFiltering
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
 *              isActive:
 *                type: boolean
 *                example: true
 */
router.put('/:id', roleAccess([RoleEnum.ADMIN]), validate(updateAppFilterValidation), controller.updateAppFiltering);

export default router;

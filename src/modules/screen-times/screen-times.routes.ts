import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import validate from '../../middlewares/validate.middleware';
import RoleEnum from '../roles/models/roles.enum';
import ScreenTimesController from './screen-times.controller';
import validations from './screen-times.validations';

const {
  addScreenTimeValidation,
  updateScreenTimeValidation,
  idParamValidation,
  addAndUpdateScreenTimeForChildrenValidation,
  getScreenTimeForChildrenValidation,
} = validations;

const router = Router();

const controller = new ScreenTimesController();

/**
 * @swagger
 * tags:
 *   name: Screentimes
 */

/**
 * @swagger
 * /screen-times:
 *   get:
 *     tags:
 *       - Screentimes
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/', roleAccess([RoleEnum.PARENT]), controller.getAllScreenTimes);

/**
 * @swagger
 * /screen-times/add:
 *   post:
 *     tags:
 *       - Screentimes
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
 *               rulename:
 *                 type: string
 *                 example: Rule 1
 *               from:
 *                 type: string
 *                 example: 10:00:00 +00:00
 *               to:
 *                 type: string
 *                 example: 10:00:00 +00:00
 *
 */
router.post('/add', roleAccess([RoleEnum.PARENT]), validate(addScreenTimeValidation), controller.addScreenTime);

/**
 * @swagger
 * /screen-times/{id}:
 *   put:
 *     tags:
 *       - Screentimes
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
 *               rulename:
 *                 type: string
 *                 example: Rule 1
 *               from:
 *                 type: string
 *                 example: 10:00:00 +00:00
 *               to:
 *                 type: string
 *                 example: 10:00:00 +00:00
 */
router.put('/:id', roleAccess([RoleEnum.PARENT]), validate(updateScreenTimeValidation), controller.updateScreenTime);

/**
 * @swagger
 * /screen-times/{id}:
 *   delete:
 *     tags:
 *       - Screentimes
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
router.delete('/:id', roleAccess([RoleEnum.PARENT]), validate(idParamValidation), controller.deleteScreenTime);

/**
 * @swagger
 * /screen-times/{id}/children:
 *   post:
 *     tags:
 *       - Screentimes
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
 *               childrenId:
 *                 type: string
 *                 format: uuid
 *
 */
router.post(
  '/:id/children',
  roleAccess([RoleEnum.PARENT]),
  validate(addAndUpdateScreenTimeForChildrenValidation),
  controller.addAndUpdateScreenTimeForChildren,
);

/**
 * @swagger
 * /screen-times/{childrenId}/children:
 *   get:
 *     tags:
 *       - Screentimes
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 *     parameters:
 *      - in: path
 *        name: childrenId
 *        required: true
 *        schema:
 *         type: string
 *         format: uuid
 */
router.get(
  '/:childrenId/children',
  roleAccess([RoleEnum.PARENT]),
  validate(getScreenTimeForChildrenValidation),
  controller.getScreenTimeForChildren,
);

export default router;

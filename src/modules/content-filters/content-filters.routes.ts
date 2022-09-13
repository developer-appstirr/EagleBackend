import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import validate from '../../middlewares/validate.middleware';
import RoleEnum from '../roles/models/roles.enum';
import ContentFiltersController from './content-filters.controller';
import validations from './content-filters.validations';

const {
  addContentFilterValidation,
  updateContentFilterValidation,
  idParamValidation,
  updateParentContentFilterValidation,
} = validations;

const router = Router();

const controller = new ContentFiltersController();

/**
 * @swagger
 * tags:
 *   name: ContentFilters
 */

/**
 * @swagger
 * /content-filters:
 *   get:
 *     tags:
 *       - ContentFilters
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/', roleAccess([RoleEnum.ADMIN]), controller.getAllContentFilters);

/**
 * @swagger
 * /content-filters/add:
 *   post:
 *     tags:
 *       - ContentFilters
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
 *               name:
 *                 type: string
 *                 example: Adult
 *
 */
router.post('/add', roleAccess([RoleEnum.ADMIN]), validate(addContentFilterValidation), controller.addContentFilter);

/**
 * @swagger
 * /content-filters/{id}:
 *   put:
 *     tags:
 *       - ContentFilters
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
 *               name:
 *                 type: string
 *                 example: Adult
 */
router.put(
  '/:id',
  roleAccess([RoleEnum.ADMIN]),
  validate(updateContentFilterValidation),
  controller.updateContentFilter,
);

/**
 * @swagger
 * /content-filters/{id}:
 *   delete:
 *     tags:
 *       - ContentFilters
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
router.delete('/:id', roleAccess([RoleEnum.ADMIN]), validate(idParamValidation), controller.deleteContentFilter);

/**
 * @swagger
 * /content-filters/{id}:
 *   post:
 *     tags:
 *       - ContentFilters
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: true
 *               alert:
 *                 type: boolean
 *                 example: true
 */
router.post(
  '/:id',
  roleAccess([RoleEnum.PARENT]),
  validate(updateParentContentFilterValidation),
  controller.updateParentContentFilter,
);

/**
 * @swagger
 * /content-filters/for-user:
 *   get:
 *     tags:
 *       - ContentFilters
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/for-user', roleAccess([RoleEnum.PARENT]), controller.getAllParentContentFilters);

export default router;

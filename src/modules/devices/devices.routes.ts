import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import validate from '../../middlewares/validate.middleware';
import RoleEnum from '../roles/models/roles.enum';
import DevicesController from './devices.controller';
import validations from './devices.validations';

const { sendApplicationLinkValidation, childrenIdParamValidation, idParamValidation } = validations;

const router = Router();

const controller = new DevicesController();

/**
 * @swagger
 * tags:
 *   name: Devices
 */

/**
 * @swagger
 * /devices/send-application:
 *   post:
 *     tags:
 *       - Devices
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
 *               email:
 *                 type: string
 *                 example: osama@gmail.com
 *
 */
router.post(
  '/send-application',
  roleAccess([RoleEnum.PARENT]),
  validate(sendApplicationLinkValidation),
  controller.sendApplicationLink,
);

/**
 * @swagger
 * /devices/children/{childrenId}:
 *   get:
 *     tags:
 *       - Devices
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
 *
 */
router.get(
  '/children/:childrenId',
  roleAccess([RoleEnum.PARENT]),
  validate(childrenIdParamValidation),
  controller.childrenDevices,
);

/**
 * @swagger
 * /devices/count/{childrenId}:
 *   get:
 *     tags:
 *       - Devices
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
 *
 */
router.get(
  '/count/:childrenId',
  roleAccess([RoleEnum.PARENT]),
  validate(childrenIdParamValidation),
  controller.childrenDevicesCount,
);

/**
 * @swagger
 * /devices/{id}:
 *   delete:
 *     tags:
 *       - Devices
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
 *
 */
router.delete('/:id', roleAccess([RoleEnum.PARENT]), validate(idParamValidation), controller.deleteChildrenDevice);
/**
 * @swagger
 * /devices/enable/{id}:
 *   post:
 *     tags:
 *       - Devices
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
 *
 */
router.post(
  '/enable/:id',
  roleAccess([RoleEnum.PARENT]),
  validate(idParamValidation),
  controller.childrenDeviceEnableOrDisable,
);

export default router;

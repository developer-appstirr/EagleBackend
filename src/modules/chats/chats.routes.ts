import { Router } from 'express';
import roleAccess from '../../middlewares/roleAccess.middleware';
import validate from '../../middlewares/validate.middleware';
import RoleEnum from '../roles/models/roles.enum';
import ScreenTimesController from './chats.controller';
import validations from './chats.validations';

const { getAllChatsValidation, getAllChatHeadsValidation } = validations;

const router = Router();

const controller = new ScreenTimesController();

/**
 * @swagger
 * tags:
 *   name: Chats
 */

/**
 * @swagger
 * /chats:
 *   get:
 *     tags:
 *       - Chats
 *     parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *        type: number
 *      - in: query
 *        name: page
 *        schema:
 *        type: number
 *      - in: query
 *        name: userId
 *        schema:
 *        type: string
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a data object.
 */
router.get('/', roleAccess([RoleEnum.PARENT, RoleEnum.ADMIN]), validate(getAllChatsValidation), controller.getAllChats);

/**
 * @swagger
 * /chats/chatHeads:
 *   get:
 *     tags:
 *       - Chats
 *     parameters:
 *      - in: query
 *        name: search
 *        required: true
 *        schema:
 *        type: string
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
router.get('/chatHeads', roleAccess([RoleEnum.ADMIN]), validate(getAllChatHeadsValidation), controller.getAllChatHeads);

export default router;

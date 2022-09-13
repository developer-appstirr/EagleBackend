import { Router } from 'express';
import validate from '../../middlewares/validate.middleware';
import validations from './auth.validations';

import AuthController from './auth.controller';

const {
  signUpValidation,
  socialLoginValidation,
  verifyAccountValidation,
  resendVerificationValidation,
  signInValidation,
  forgotPasswordValidation,
  verifyForgotPasswordValidation,
  changePasswordValidation,
} = validations;

const router = Router();

const controller = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     responses:
 *       201:
 *         description: Returns a data object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: The user's name.
 *                 example: Osama bin laden
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: osama@gmail.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: ~!ab12
 *               phone:
 *                 type: string
 *                 description: The user's password.
 *                 example: +9230000000
 */
router.post('/signUp', validate(signUpValidation), controller.signup);

/**
 * @swagger
 * /auth/social-login:
 *   post:
 *     tags:
 *       - Auth
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
 *               fullname:
 *                 type: string
 *                 description: The user's name.
 *                 example: Osama bin laden
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: osama@gmail.com
 *               loginType:
 *                 type: string
 *                 default: FACEBOOK
 *                 enum: ["FACEBOOK", "GOOGLE"]
 */
router.post('/social-login', validate(socialLoginValidation), controller.socialLogin);

/**
 * @swagger
 * /auth/account-verify:
 *   post:
 *     tags:
 *       - Auth
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
 *                 description: The user's email.
 *                 example: osama@gmail.com
 *               code:
 *                 type: number
 *                 description: The user's code.
 *                 example: 0000
 *
 */
router.post('/account-verify', validate(verifyAccountValidation), controller.verifyAccount);

/**
 * @swagger
 * /auth/resend-account-verify:
 *   post:
 *     tags:
 *       - Auth
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
 *                 description: The user's email.
 *                 example: osama@gmail.com
 *
 */
router.post('/resend-account-verify', validate(resendVerificationValidation), controller.resendVerifyAccount);

/**
 * @swagger
 * /auth/signIn:
 *   post:
 *     tags:
 *       - Auth
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
 *                 description: The user's email.
 *                 example: osama@gmail.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: ~!ab12
 *
 */
router.post('/signIn', validate(signInValidation), controller.signIn);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
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
 *                 description: The user's email.
 *                 example: osama@gmail.com
 *
 */
router.post('/forgot-password', validate(forgotPasswordValidation), controller.forgotPassword);

/**
 * @swagger
 * /auth/forgot-password-verify:
 *   post:
 *     tags:
 *       - Auth
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
 *                 description: The user's email.
 *                 example: osama@gmail.com
 *               code:
 *                 type: number
 *                 description: The user's code.
 *                 example: 0000
 *
 */
router.post('/forgot-password-verify', validate(verifyForgotPasswordValidation), controller.verifyForgotPassword);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
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
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password
 *
 */
router.post('/change-password', validate(changePasswordValidation), controller.changePassword);

export default router;

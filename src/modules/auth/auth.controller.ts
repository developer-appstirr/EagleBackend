import { isAfter, isBefore } from 'date-fns';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { getCustomRepository } from 'typeorm';
import Common from '../../libraries/common.lib';
import * as Mailer from '../../libraries/mailer.lib';
import DefaultEmailTemplate from '../../libraries/email-template/default-email-template';
import ErrorFactory from '../../libraries/factories/error.factory';
import JWT from '../../libraries/jwtManager.lib';
import AccountErrors from '../../libraries/mappings/errors/account.errors';
import AccountSuccess from '../../libraries/mappings/success/account.success';
import sendResponse from '../../libraries/sendResponse.lib';
import RolesRepository from '../roles/repositories/roles.repository';
import SettingsRepository from '../users/repositories/settings.repository';
import UsersRepository from '../users/repositories/users.repository';
import CodeVerficationsEnum from './models/code-verifications.enum';
import CodeVerficationsRepository from './repositories/code-verifications.repository';
import ContentFilterForUsersRepository from '../content-filters/repositories/content-filter-for-users.repository';
import ContentFiltersRepository from '../content-filters/repositories/content-filters.repository';
import SubscriptionHistoriesRepository from '../subscriptions/repositories/subscription-histories.repository';

export default class AuthController {
  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get role repository
      const rolesRepository = getCustomRepository(RolesRepository);

      // get user role
      const role = await rolesRepository.findParentRole();
      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);
      // create user with role
      const user = await usersRepository.saveUser({ ...req.body, role });
      // get code verfication repository
      const codeVerficationsRepository = getCustomRepository(CodeVerficationsRepository);

      // get content filter repository
      const contentFiltersRepository = getCustomRepository(ContentFiltersRepository);

      // get All content filters
      const contentFilters = await contentFiltersRepository.findAll();

      // get content filter for users repository
      const contentFilterForUsersRepository = getCustomRepository(ContentFilterForUsersRepository);

      // get user repository
      const settingsRepository = getCustomRepository(SettingsRepository);

      const code = await Common.generateNumericCode();

      // create user verification code
      codeVerficationsRepository.saveCodeVerifications(user, +code);

      // create user initial setting
      settingsRepository.saveSetting(user);

      // create user initial content filters
      contentFilterForUsersRepository.saveContentFiltersForUser(user, contentFilters);

      Mailer.sendEmail({
        recipientEmail: user.email,
        subject: 'Please verify your email at Eagle',
        content: DefaultEmailTemplate.get(`<tr>
        <th
          class="rnb-force-col"
          style="text-align: left; font-weight: normal; padding-right: 0px"
          valign="top"
        >
          <table
            border="0"
            valign="top"
            cellspacing="0"
            cellpadding="0"
            width="100%"
            align="left"
            class="rnb-col-1"
          >
            <tbody>
              <tr>
                <td
                  style="
                    font-size: 14px;
                    font-family: Arial, Helvetica, sans-serif, sans-serif;
                    color: #3c4858;
                  "
                >
                  <div>
                  Hello ${user.fullname}!<br />
                    <br />
                    Thank you for registering your account at eagle .Please verify your account with OTP.<br />
                    <br />
                    Your Verification Code is: ${code}.
                    <br />
                    <br />
                    </div>
                </td>
              </tr>
            </tbody>
          </table>
        </th>
      </tr>
      `),
      });

      // send response back to user
      sendResponse(
        res,
        AccountSuccess.ACCOUNT_CREATION_SUCCESS,
        'Account created successfully',
        {},
        httpStatus.CREATED,
      );
    } catch (error: any) {
      if (error.code === '23505') {
        if (error.detail.includes('email')) {
          next(ErrorFactory.getError(AccountErrors.ACCOUNT_ALREADY_EXIST_EMAIL));
        }
      } else {
        next(error);
      }
    }
  };

  verifyAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get code verfication repository
      const codeVerficationsRepository = getCustomRepository(CodeVerficationsRepository);

      const codeVerify = await codeVerficationsRepository.findVerifyAccount(
        req.body.email,
        CodeVerficationsEnum.VERIFICATION,
      );

      if (!codeVerify) {
        throw ErrorFactory.getError(AccountErrors.ACCOUNT_NOT_FOUND);
      }

      // check if user otp request exists
      if (codeVerify.code === null || codeVerify.user.isVerified) {
        throw ErrorFactory.getError(AccountErrors.ACCOUNT_ALREADY_EMAIL_VERIFIED);
      }

      // check if user otp match or not
      if (codeVerify.code !== req.body.code) {
        throw ErrorFactory.getError(AccountErrors.INVALID_EMAIL_VERIFICATION_OTP);
      }

      // check if user otp expires or not
      if (isAfter(new Date(), codeVerify.expireTime)) {
        throw ErrorFactory.getError(AccountErrors.EXPIRE_EMAIL_VERIFICATION_OTP);
      }

      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      const user = await (
        await usersRepository.saveUser({ ...codeVerify.user.userSanitize(), isVerified: true })
      ).userSanitize();

      // get subscriptions history repository
      const subscriptionHistoriesRepository = getCustomRepository(SubscriptionHistoriesRepository);

      const findActiveSubscription = await subscriptionHistoriesRepository.findActiveSubscription(user);

      let subscription;

      if (findActiveSubscription && !isBefore(new Date(findActiveSubscription.expiryDate), new Date())) {
        subscription = findActiveSubscription.subscription;
      } else {
        subscription = {};
      }

      // send response back to user
      sendResponse(res, AccountSuccess.ACCOUNT_VERIFICATION_SUCCESS, 'Account verify successfully', {
        user: { ...user, subscription },
        token: JWT.generateToken({ user }),
      });
    } catch (error) {
      next(error);
    }
  };

  resendVerifyAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      const isExist = await usersRepository.findOne({ email: req.body.email });

      if (!isExist) {
        throw ErrorFactory.getError(AccountErrors.ACCOUNT_NOT_FOUND);
      }

      if (isExist.isVerified) {
        throw ErrorFactory.getError(AccountErrors.ACCOUNT_ALREADY_EMAIL_VERIFIED);
      }

      // get code verfication repository
      const codeVerficationsRepository = getCustomRepository(CodeVerficationsRepository);

      const code = await Common.generateNumericCode();

      codeVerficationsRepository.updateCodeVerifications(isExist, CodeVerficationsEnum.VERIFICATION, +code);

      Mailer.sendEmail({
        recipientEmail: isExist.email,
        subject: 'Please verify your email at Eagle',
        content: DefaultEmailTemplate.get(`<tr>
        <th
          class="rnb-force-col"
          style="text-align: left; font-weight: normal; padding-right: 0px"
          valign="top"
        >
          <table
            border="0"
            valign="top"
            cellspacing="0"
            cellpadding="0"
            width="100%"
            align="left"
            class="rnb-col-1"
          >
            <tbody>
              <tr>
                <td
                  style="
                    font-size: 14px;
                    font-family: Arial, Helvetica, sans-serif, sans-serif;
                    color: #3c4858;
                  "
                >
                <div>
                Hello ${isExist.fullname}!<br />
                  <br />
                  Looks like you missed the previous email we sent with the Verification Code. No worries, here is another email.<br />
                  <br />
                  Your Verification Code is: ${code}.
                  <br />
                  <br />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </th>
      </tr>
      `),
      });

      // send response back to user
      sendResponse(res, AccountSuccess.ACCOUNT_VERIFICATION_EMAIL_SENT, 'Verification code sended successfully');
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      const user = await usersRepository.findOne({ email });

      if (!user || !user.validatePassword(password)) {
        throw ErrorFactory.getError(AccountErrors.INVALID_LOGIN_CREDENTIALS);
      }

      if (!user.isVerified) {
        throw ErrorFactory.getError(AccountErrors.ACCOUNT_NOT_EMAIL_VERIFIED);
      }

      // get subscriptions history repository
      const subscriptionHistoriesRepository = getCustomRepository(SubscriptionHistoriesRepository);

      const findActiveSubscription = await subscriptionHistoriesRepository.findActiveSubscription(user);

      let subscription;

      if (findActiveSubscription && !isBefore(new Date(findActiveSubscription.expiryDate), new Date())) {
        subscription = findActiveSubscription.subscription;
      } else {
        subscription = {};
      }

      const userData = user.userSanitize();
      sendResponse(res, AccountSuccess.ACCOUNT_CREDENTIALS_SUCCESS, 'Account credentials correct', {
        user: { ...userData, subscription },
        token: JWT.generateToken({ user: userData }),
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      const isExist = await usersRepository.findOne({ email: req.body.email });

      if (!isExist) {
        throw ErrorFactory.getError(AccountErrors.ACCOUNT_NOT_FOUND);
      }

      // get code verfication repository
      const codeVerficationsRepository = getCustomRepository(CodeVerficationsRepository);

      const code = await Common.generateNumericCode();

      await codeVerficationsRepository.updateCodeVerifications(isExist, CodeVerficationsEnum.FORGOT_PASSWORD, +code);

      Mailer.sendEmail({
        recipientEmail: isExist.email,
        subject: 'Forgot Password',
        content: DefaultEmailTemplate.get(`<tr>
        <th
          class="rnb-force-col"
          style="text-align: left; font-weight: normal; padding-right: 0px"
          valign="top"
        >
          <table
            border="0"
            valign="top"
            cellspacing="0"
            cellpadding="0"
            width="100%"
            align="left"
            class="rnb-col-1"
          >
            <tbody>
              <tr>
                <td
                  style="
                    font-size: 14px;
                    font-family: Arial, Helvetica, sans-serif, sans-serif;
                    color: #3c4858;
                  "
                >
                <div>
                Hello ${isExist.fullname}!<br />
                  <br />
                  Looks like you have forgotten your password at eagle.<br />
                  <br />
                  Your Verification Code is: ${code}.
                  <br />
                  <br />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </th>
      </tr>
      `),
      });

      sendResponse(res, AccountSuccess.FORGOT_PASSWORD_EMAIL_SENT, 'Forgot password request sended successfully');
    } catch (error) {
      next(error);
    }
  };

  verifyForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get code verfication repository
      const codeVerficationsRepository = getCustomRepository(CodeVerficationsRepository);

      const codeVerify = await codeVerficationsRepository.findVerifyAccount(
        req.body.email,
        CodeVerficationsEnum.FORGOT_PASSWORD,
      );

      if (!codeVerify) {
        throw ErrorFactory.getError(AccountErrors.ACCOUNT_NOT_FOUND);
      }

      if (codeVerify.code === null) {
        throw ErrorFactory.getError(AccountErrors.ACCOUNT_FORGOT_PASSWORD_NOT_REQUESTED_YET);
      }

      // check if forgot password otp match or not
      if (codeVerify.code !== req.body.code) {
        throw ErrorFactory.getError(AccountErrors.INVALID_FORGOT_PASSWORD_OTP);
      }

      // check if forgot password otp expires or not
      if (isAfter(new Date(), codeVerify.expireTime)) {
        throw ErrorFactory.getError(AccountErrors.EXPIRE_FORGOT_PASSWORD_OTP);
      }

      // update user forgot token and pull all email verification otps from array

      const token = await Common.generateTokenCode(24);

      codeVerficationsRepository.update(
        { user: codeVerify.user, codeType: CodeVerficationsEnum.FORGOT_PASSWORD },
        {
          code: null,
          token,
        },
      );
      sendResponse(res, AccountSuccess.FORGOT_PASSWORD_OTP_SUCCESS, 'Forgot password request sended successfully', {
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.query;

      // get code verfication repository
      const codeVerficationsRepository = getCustomRepository(CodeVerficationsRepository);

      const tokenVerify = await codeVerficationsRepository.findAccountForChangePassword(token as string);

      if (!tokenVerify) {
        throw ErrorFactory.getError(AccountErrors.INVALID_FORGOT_PASSWORD_TOKEN);
      }

      codeVerficationsRepository.saveCodeVerification({
        ...tokenVerify,
        token: null,
        code: null,
      });

      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      usersRepository.saveUser({ ...tokenVerify.user, password: req.body.password });

      sendResponse(res, AccountSuccess.PASSWORD_RESET_SUCCESS, 'Change password otp success');
    } catch (error) {
      next(error);
    }
  };

  socialLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      // get role repository
      const rolesRepository = getCustomRepository(RolesRepository);

      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      const isExist = await usersRepository.findOne({ email });

      if (!isExist) {
        // get user role
        const role = await rolesRepository.findParentRole();
        const user = await usersRepository.saveUser({ ...req.body, role });

        // get code verfication repository
        const codeVerficationsRepository = getCustomRepository(CodeVerficationsRepository);

        const code = await Common.generateNumericCode();

        // create user verification code

        codeVerficationsRepository.saveCodeVerifications(user, +code);

        // get content filter repository
        const contentFiltersRepository = getCustomRepository(ContentFiltersRepository);

        // get All content filters
        const contentFilters = await contentFiltersRepository.findAll();

        // get content filter for users repository
        const contentFilterForUsersRepository = getCustomRepository(ContentFilterForUsersRepository);

        // get user repository
        const settingsRepository = getCustomRepository(SettingsRepository);

        // create user initial setting
        settingsRepository.saveSetting(user);

        // create user initial content filters
        contentFilterForUsersRepository.saveContentFiltersForUser(user, contentFilters);

        Mailer.sendEmail({
          recipientEmail: user.email,
          subject: 'Please verify your email at Eagle',
          content: DefaultEmailTemplate.get(`<tr>
          <th
            class="rnb-force-col"
            style="text-align: left; font-weight: normal; padding-right: 0px"
            valign="top"
          >
            <table
              border="0"
              valign="top"
              cellspacing="0"
              cellpadding="0"
              width="100%"
              align="left"
              class="rnb-col-1"
            >
              <tbody>
                <tr>
                  <td
                    style="
                      font-size: 14px;
                      font-family: Arial, Helvetica, sans-serif, sans-serif;
                      color: #3c4858;
                    "
                  >
                  <div>
                  Hello ${user.fullname}!<br />
                    <br />
                    Thank you for registering your account at eagle .Please verify your account with OTP.<br />
                    <br />
                    Your Verification Code is: ${code}.
                    <br />
                    <br />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </th>
        </tr>
        `),
        });

        // send response back to user
        sendResponse(
          res,
          AccountSuccess.ACCOUNT_CREATION_SUCCESS,
          'Account created successfully',
          {},
          httpStatus.CREATED,
        );
      }

      if (!isExist?.isVerified) {
        throw ErrorFactory.getError(AccountErrors.ACCOUNT_NOT_EMAIL_VERIFIED);
      }

      // get subscriptions history repository
      const subscriptionHistoriesRepository = getCustomRepository(SubscriptionHistoriesRepository);

      const findActiveSubscription = await subscriptionHistoriesRepository.findActiveSubscription(isExist);

      let subscription;

      if (findActiveSubscription && !isBefore(new Date(findActiveSubscription.expiryDate), new Date())) {
        subscription = findActiveSubscription.subscription;
      } else {
        subscription = {};
      }

      const userData = isExist.userSanitize();
      delete userData.role;
      // send response back to user
      sendResponse(res, AccountSuccess.ACCOUNT_SOCIAL_LOGIN_SUCCESS, 'Account social login successfully', {
        user: { ...userData, subscription },
        token: JWT.generateToken({ user: userData }),
      });
    } catch (error: any) {
      if (error.code === '23505') {
        if (error.detail.includes('email')) {
          next(ErrorFactory.getError(AccountErrors.ACCOUNT_ALREADY_EXIST_EMAIL));
        }
      } else {
        next(error);
      }
    }
  };
}

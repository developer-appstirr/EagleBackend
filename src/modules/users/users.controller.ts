import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import IUserRequest from '../../libraries/interfaces/request.interface';
import ErrorFactory from '../../libraries/factories/error.factory';
import AccountErrors from '../../libraries/mappings/errors/account.errors';
import AccountSuccess from '../../libraries/mappings/success/account.success';
import UserSuccess from '../../libraries/mappings/success/user.success';

import sendResponse from '../../libraries/sendResponse.lib';
import SettingsRepository from './repositories/settings.repository';
import UsersRepository from './repositories/users.repository';
import FileUpload from '../../libraries/fileUpload.lib';
import SettingEntity from './entities/setting.entity';
import UserEntity from './entities/user.entity';

export default class UsersController {
  updateProfile = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);
      // user profile update
      const user = await (await usersRepository.saveUser({ id: req.user.id, ...req.body })).userSanitize();

      // send response back to user
      sendResponse(res, AccountSuccess.ACCOUNT_UPDATE_SUCCESS, 'Account updated successfully', { user });
    } catch (error: any) {
      next(error);
    }
  };

  updateProfileImage = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        file,
        user: { id },
      } = req;

      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      const userForImage = await usersRepository.findOne({ id });

      const uploadResult = await FileUpload.fileUpload(file, 'users');

      if (userForImage?.imageUrl != null && userForImage?.imageUrl !== 'users/profile.png') {
        FileUpload.fileDelete(userForImage.imageUrl);
      }

      // user profile update
      const user = await (
        await usersRepository.saveUser({ id: req.user.id, imageUrl: uploadResult.key })
      ).userSanitize();

      // send response back to user
      sendResponse(res, AccountSuccess.ACCOUNT_UPDATE_SUCCESS, 'Account updated successfully', { user });
    } catch (error: any) {
      next(error);
    }
  };

  changePassword = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.user;

      const { password, newPassword } = req.body;

      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      const isExist = await usersRepository.findOne({ email });

      if (!isExist?.validatePassword(password)) {
        throw ErrorFactory.getError(AccountErrors.INVALID_OLD_PASSWORD);
      }
      await usersRepository.saveUser({ ...isExist, password: newPassword });
      // send response back to user
      sendResponse(res, AccountSuccess.PASSWORD_RESET_SUCCESS, 'Change password successfully');
    } catch (error: any) {
      next(error);
    }
  };

  accountSetting = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // send response back to user
      sendResponse(res, AccountSuccess.ACCOUNT_SETTING_GET_SUCCESS, 'account setting get successfully', {
        setting: req.user.setting,
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateAccountSetting = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get setting repository
      const settingsRepository = getCustomRepository(SettingsRepository);

      const setting = await settingsRepository.save(
        new SettingEntity({
          id: req.user.setting.id,
          user: req.user.id,
          ...req.body,
        }),
      );

      // send response back to user
      sendResponse(res, AccountSuccess.ACCOUNT_SETTING_UPDATE_SUCCESS, 'account setting updated successfully', {
        setting,
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateDeviceToken = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      await usersRepository.save(
        new UserEntity({
          id: req.user.id,
          ...req.body,
        }),
      );

      // send response back to user
      sendResponse(res, AccountSuccess.ACCOUNT_DEVICE_TOKEN_UPDATE_SUCCESS, 'account device token update successfully');
    } catch (error: any) {
      next(error);
    }
  };

  findAllUserManagement = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { pagination } = req.query;
      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);
      let users;

      if (pagination === 'true') {
        users = await usersRepository.findAllUserManagement(req.query);
      } else {
        console.log('first,first,first');
        users = await usersRepository.findAllUsersWithOutPagination(req.query);
      }

      // send response back to user
      sendResponse(res, UserSuccess.GET_ALL_USERS, 'Get all Users', users);
    } catch (error: any) {
      next(error);
    }
  };
}

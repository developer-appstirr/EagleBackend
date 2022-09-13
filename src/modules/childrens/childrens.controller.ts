import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import IUserRequest from '../../libraries/interfaces/request.interface';
import ErrorFactory from '../../libraries/factories/error.factory';
import ChildrenErrors from '../../libraries/mappings/errors/children.errors';
import DeviceErrors from '../../libraries/mappings/errors/device.errors';
import ChildrenSuccess from '../../libraries/mappings/success/children.success';
import JWT from '../../libraries/jwtManager.lib';

import sendResponse from '../../libraries/sendResponse.lib';
import RolesRepository from '../roles/repositories/roles.repository';
import ChildrensRepository from './repositories/childrens.repository';
import FileUpload from '../../libraries/fileUpload.lib';
import AccountErrors from '../../libraries/mappings/errors/account.errors';
import AccountSuccess from '../../libraries/mappings/success/account.success';
import DevicesRepository from '../devices/repositories/devices.repository';

export default class ChildrensController {
  getAllChildren = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      // get All childrens
      const childrens = await childrensRepository.findAll(req.user);

      // send response back to user
      sendResponse(res, ChildrenSuccess.CHILDREN_GET_SUCCESS, 'Get all childrens successfully', { childrens });
    } catch (error: any) {
      next(error);
    }
  };

  addChildren = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get role repository
      const rolesRepository = getCustomRepository(RolesRepository);

      // get user role
      const role = await rolesRepository.findChildrenRole();

      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      // add children
      const children = await (
        await childrensRepository.saveChildren({ role, user: req.user, ...req.body })
      ).childrenSanitize();

      // send response back to user
      sendResponse(res, ChildrenSuccess.CHILDREN_ADDED_SUCCESS, 'Children added successfully', { children });
    } catch (error: any) {
      if (error.code === '23505') {
        if (error.detail.includes('username')) {
          next(ErrorFactory.getError(ChildrenErrors.CHILDREN_ALREADY_EXIST_USERNAME));
        }
      } else {
        next(error);
      }
    }
  };

  updateChildren = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      const isExist = await childrensRepository.findOne({ id });

      if (!isExist) {
        throw ErrorFactory.getError(ChildrenErrors.CHILDREN_DOES_NOT_EXIST);
      }

      // update children
      const children = await (await childrensRepository.saveChildren({ id, ...req.body })).childrenSanitize();

      // send response back to user
      sendResponse(res, ChildrenSuccess.CHILDREN_UPDATED_SUCCESS, 'Children updated successfully', { children });
    } catch (error: any) {
      next(error);
    }
  };

  childrenUpdateImage = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        file,
        params: { id },
      } = req;
      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      const childrenForImage = await childrensRepository.findOne({ id });

      if (!childrenForImage) {
        throw ErrorFactory.getError(ChildrenErrors.CHILDREN_DOES_NOT_EXIST);
      }

      const uploadResult = await FileUpload.fileUpload(file, 'childrens');

      if (childrenForImage?.imageUrl != null && childrenForImage?.imageUrl !== 'users/profile.png') {
        FileUpload.fileDelete(childrenForImage.imageUrl);
      }

      // children profile update
      const children = await (
        await childrensRepository.saveChildren({ id, imageUrl: uploadResult.key })
      ).childrenSanitize();

      // send response back to user
      sendResponse(res, ChildrenSuccess.CHILDREN_UPDATED_SUCCESS, 'Children updated successfully', { children });
    } catch (error: any) {
      next(error);
    }
  };

  deleteChildren = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      const isExist = await childrensRepository.findOne({ id });

      if (!isExist) {
        throw ErrorFactory.getError(ChildrenErrors.CHILDREN_DOES_NOT_EXIST);
      }
      await childrensRepository.softRemove({ id });
      // send response back to user
      sendResponse(res, ChildrenSuccess.CHILDREN_DELETED_SUCCESS, 'Children deleted successfully');
    } catch (error: any) {
      next(error);
    }
  };

  signInChildren = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password, deviceName, deviceType, imeiNumber, version } = req.body;
      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      // get device repository
      const devicesRepository = getCustomRepository(DevicesRepository);

      const child = await childrensRepository.findOne({ username });

      if (!child || !child.validatePassword(password)) {
        throw ErrorFactory.getError(AccountErrors.INVALID_LOGIN_CREDENTIALS);
      }

      let isExistDevice = await devicesRepository.findOne({ imeiNumber, children: child });

      if (!isExistDevice) {
        isExistDevice = await devicesRepository.saveDevice({
          children: child,
          deviceName,
          deviceType,
          imeiNumber,
          version,
        });
      }

      if (!isExistDevice?.status) {
        throw ErrorFactory.getError(DeviceErrors.YOUR_DEVICE_DISABLE);
      }

      const childForToken = { ...child.childrenSanitize(), deviceId: isExistDevice.id };
      const childData = { ...childForToken };
      delete childForToken.qrCode;
      sendResponse(res, AccountSuccess.ACCOUNT_CREDENTIALS_SUCCESS, 'Account credentials correct', {
        children: { ...childData },
        token: JWT.generateToken({ child: childForToken }),
      });
    } catch (error) {
      next(error);
    }
  };

  updateChildrenProfile = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.child;

      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      // update children
      const children = await (await childrensRepository.saveChildren({ id, ...req.body })).childrenSanitize();

      // send response back to user
      sendResponse(res, AccountSuccess.ACCOUNT_UPDATE_SUCCESS, 'Account updated successfully', { children });
    } catch (error: any) {
      next(error);
    }
  };

  updateChildrenProfileImage = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        file,
        child: { id, imageUrl },
      } = req;
      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      const uploadResult = await FileUpload.fileUpload(file, 'childrens');

      if (imageUrl != null && imageUrl !== 'users/profile.png') {
        FileUpload.fileDelete(imageUrl);
      }

      // children profile update
      const children = await (
        await childrensRepository.saveChildren({ id, imageUrl: uploadResult.key })
      ).childrenSanitize();

      // send response back to user
      sendResponse(res, AccountSuccess.ACCOUNT_UPDATE_SUCCESS, 'Account updated successfully', { children });
    } catch (error: any) {
      next(error);
    }
  };
}

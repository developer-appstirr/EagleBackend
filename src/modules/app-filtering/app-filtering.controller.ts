import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import IUserRequest from '../../libraries/interfaces/request.interface';
import ErrorFactory from '../../libraries/factories/error.factory';
import AppFilteringErrors from '../../libraries/mappings/errors/app-filtering.errors';

import AppFilteringSuccess from '../../libraries/mappings/success/app-filtering.success';
import sendResponse from '../../libraries/sendResponse.lib';
import AppFilteringRepository from './repositories/app-filtering.repository';
import RoleEnum from '../roles/models/roles.enum';

export default class AppFilteringController {
  getAll = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { role } = req.user;

      // get app filtering repository
      const appFilteringRepository = getCustomRepository(AppFilteringRepository);

      const filter = role.name === RoleEnum.PARENT ? { isActive: true } : {};

      const appsFilter = await appFilteringRepository.findAll(filter);

      // send response back to user
      sendResponse(res, AppFilteringSuccess.APP_FILTERING_GET_SUCCESS, 'Get all app filtering successfully', {
        appsFilter,
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateAppFiltering = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get app filtering repository
      const appFilteringRepository = getCustomRepository(AppFilteringRepository);

      const isExist = await appFilteringRepository.findOne({
        where: { id: req.params.id },
      });

      if (!isExist) {
        throw ErrorFactory.getError(AppFilteringErrors.APP_FILTERING_DOES_NOT_EXIST);
      }

      const appFilter = await appFilteringRepository.saveAppFiltering({
        ...isExist,
        ...req.body,
      });

      // send response back to user
      sendResponse(res, AppFilteringSuccess.APP_FILTERING_UPDATE_SUCCESS, 'App filtering updated successfully', {
        appFilter,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

import { NextFunction, Response } from 'express';
import { parse, parseISO } from 'date-fns';
import { format, zonedTimeToUtc } from 'date-fns-tz';
import { getCustomRepository } from 'typeorm';
import ErrorFactory from '../../libraries/factories/error.factory';
import IUserRequest from '../../libraries/interfaces/request.interface';
import ScreenTimeErrors from '../../libraries/mappings/errors/screen-time.errors';
import ChildrenErrors from '../../libraries/mappings/errors/children.errors';
import ScreenTimeSuccess from '../../libraries/mappings/success/screen-time.success';
import sendResponse from '../../libraries/sendResponse.lib';
import ScreenTimesRepository from './repositories/screen-times.repository';
import ScreenTimesForChildrensRepository from './repositories/screen-times-for-childrens.repository';
import ChildrensRepository from '../childrens/repositories/childrens.repository';

export default class ScreenTimesController {
  getAllScreenTimes = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get screen times repository
      const screenTimesRepository = getCustomRepository(ScreenTimesRepository);
      // get All screen times
      const screenTimes = await screenTimesRepository.findAll(req.user);

      // send response back to user
      sendResponse(res, ScreenTimeSuccess.SCREEN_TIME_GET_SUCCESS, 'Get all screen times successfully', {
        screenTimes,
      });
    } catch (error: any) {
      next(error);
    }
  };

  addScreenTime = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get screen times repository
      const screenTimesRepository = getCustomRepository(ScreenTimesRepository);
      const dateFrom = new Date();
      dateFrom.setTime(req.body.from);

      // add screen time
      const screenTime = await screenTimesRepository.saveScreenTime({
        user: req.user,
        ...req.body,
      });
      // send response back to user
      sendResponse(res, ScreenTimeSuccess.SCREEN_TIME_ADDED_SUCCESS, 'Screen time added successfully', { screenTime });
    } catch (error: any) {
      next(error);
    }
  };

  updateScreenTime = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // get screen times repository
      const screenTimesRepository = getCustomRepository(ScreenTimesRepository);

      const isExist = await screenTimesRepository.findOne({ id });

      if (!isExist) {
        throw ErrorFactory.getError(ScreenTimeErrors.SCREEN_TIME_DOES_NOT_EXIST);
      }

      //  console.log(dateFrom.toLocaleTimeString());
      // console.log(format(zonedTimeToUtc(dateFrom, 'UTC'), 'kk:mm:ss xxx', { timeZone: 'UTC' }));
      // add screen time
      const screenTime = await screenTimesRepository.saveScreenTime({
        id,
        ...req.body,
        // rulename: req.body.rulename,
        // from: format(zonedTimeToUtc(dateFrom, 'UTC'), 'kk:mm:ss xxx', { timeZone: 'UTC' }),
        // to: format(zonedTimeToUtc(dateFrom, 'UTC'), 'kk:mm:ss xxx', { timeZone: 'UTC' }),
      });

      // send response back to user
      sendResponse(res, ScreenTimeSuccess.SCREEN_TIME_UPDATED_SUCCESS, 'Screen time updated successfully', {
        screenTime,
      });
    } catch (error: any) {
      next(error);
    }
  };

  deleteScreenTime = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // get screen times repository
      const screenTimesRepository = getCustomRepository(ScreenTimesRepository);

      // get screen times for childrens repository
      const screenTimesForChildrensRepository = getCustomRepository(ScreenTimesForChildrensRepository);

      const isExist = await screenTimesRepository.findOne({ id });

      if (!isExist) {
        throw ErrorFactory.getError(ScreenTimeErrors.SCREEN_TIME_DOES_NOT_EXIST);
      }

      const isExistScreenTimeForChildren = await screenTimesForChildrensRepository.findOne({ screenTime: isExist });

      if (isExistScreenTimeForChildren) {
        throw ErrorFactory.getError(ScreenTimeErrors.SCREEN_TIME_IS_ASSIGNED_TO_USER_FIRST_REMOVE_FROM_USER);
      }

      await screenTimesRepository.softRemove({ id });
      // send response back to user
      sendResponse(res, ScreenTimeSuccess.SCREEN_TIME_DELETED_SUCCESS, 'Screen time deleted successfully');
    } catch (error: any) {
      next(error);
    }
  };

  addAndUpdateScreenTimeForChildren = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        params: { id },
        body: { childrenId },
        user,
      } = req;

      // get screen times repository
      const screenTimesRepository = getCustomRepository(ScreenTimesRepository);

      // get screen times for childrens repository
      const screenTimesForChildrensRepository = getCustomRepository(ScreenTimesForChildrensRepository);

      const isExist = await screenTimesRepository.findOne({ id });

      if (!isExist) {
        throw ErrorFactory.getError(ScreenTimeErrors.SCREEN_TIME_DOES_NOT_EXIST);
      }

      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      const isExistChildren = await childrensRepository.findOne({ id: childrenId, user });

      if (!isExistChildren) {
        throw ErrorFactory.getError(ChildrenErrors.CHILDREN_DOES_NOT_EXIST);
      }

      const isExistScreenTimeForChildren = await screenTimesForChildrensRepository.findOne({
        children: isExistChildren,
      });

      const screenTime = await screenTimesForChildrensRepository.saveScreenTimeForChildren(
        isExistScreenTimeForChildren?.id,
        {
          screenTime: isExist.id,
          children: isExistChildren.id,
        },
      );

      // send response back to user
      sendResponse(res, ScreenTimeSuccess.SCREEN_TIME_UPDATED_SUCCESS, 'Screen time updated successfully', screenTime);
    } catch (error: any) {
      next(error);
    }
  };

  getScreenTimeForChildren = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        params: { childrenId },
        user,
      } = req;

      // get screen times for childrens repository
      const screenTimesForChildrensRepository = getCustomRepository(ScreenTimesForChildrensRepository);

      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      const isExistChildren = await childrensRepository.findOne({ id: childrenId, user });

      if (!isExistChildren) {
        throw ErrorFactory.getError(ChildrenErrors.CHILDREN_DOES_NOT_EXIST);
      }

      const screenTime = await screenTimesForChildrensRepository.findOne({
        relations: ['screenTime'],
        where: {
          children: isExistChildren,
        },
      });

      // send response back to user
      sendResponse(res, ScreenTimeSuccess.SCREEN_TIME_UPDATED_SUCCESS, 'Screen time updated successfully', screenTime);
    } catch (error: any) {
      next(error);
    }
  };
}

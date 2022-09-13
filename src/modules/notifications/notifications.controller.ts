import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import IUserRequest from '../../libraries/interfaces/request.interface';
import NotificationSuccess from '../../libraries/mappings/success/notification.success';
import sendResponse from '../../libraries/sendResponse.lib';
import NotificationsRepository from './repositories/notifications.repository';
import GlobalNotificationsRepository from './repositories/global-notifications.repository';
import UsersRepository from '../users/repositories/users.repository';
import firebase from '../../libraries/firebase/index';
import UserEntity from '../users/entities/user.entity';

export default class NotificationsController {
  getAllNotifications = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get notifications repository
      const notificationsRepository = getCustomRepository(NotificationsRepository);
      // get All notification
      const notifications = await notificationsRepository.findAll(req.user, req.query);

      // send response back to user
      sendResponse(
        res,
        NotificationSuccess.NOTIFICATION_GET_SUCCESS,
        'Get all notifications successfully',
        notifications,
      );
    } catch (error: any) {
      next(error);
    }
  };

  getGlobalNotifications = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get global notifications repository
      const globalNotificationsRepository = getCustomRepository(GlobalNotificationsRepository);
      // get All notification
      const notifications = await globalNotificationsRepository.findAllGlobalNotifications(req.query);

      // send response back to user
      sendResponse(
        res,
        NotificationSuccess.NOTIFICATION_GET_SUCCESS,
        'Get all notifications successfully',
        notifications,
      );
    } catch (error: any) {
      next(error);
    }
  };

  getUnReadNotificationsCount = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get notifications repository
      const notificationsRepository = getCustomRepository(NotificationsRepository);

      const notificationsCount = await notificationsRepository.getUnReadCount(req.user);

      // send response back to user
      sendResponse(res, NotificationSuccess.NOTIFICATION_GET_SUCCESS, 'Get unread notification count successfully', {
        notificationsCount,
      });
    } catch (error: any) {
      next(error);
    }
  };

  sendNotification = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, body } = req.body;
      // get notifications repository
      const notificationsRepository = getCustomRepository(NotificationsRepository);

      // get global notifications repository
      const globalNotificationsRepository = getCustomRepository(GlobalNotificationsRepository);

      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      const users: UserEntity[] = await usersRepository.getUsersDeviceTokens(req.body);
      const tokens = users.map((user) => user.deviceToken).filter((user) => !!user);
      const message = {
        notification: {
          title,
          body,
        },
        // NOTE: The 'data' object is inside payload, not inside notification
        data: {
          CONSTANT: '',
        },
      };
      const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24,
      };
      if (tokens.length) {
        await firebase.notication.sendToDevice(tokens, message, options);
      }

      // store All notifications
      notificationsRepository.storeMany(req.body, users);

      // store global notification
      globalNotificationsRepository.saveNotification(req.body);

      // send response back to user
      sendResponse(res, NotificationSuccess.NOTIFICATION_GET_SUCCESS, 'Send all notifications successfully');
    } catch (error: any) {
      next(error);
    }
  };
}

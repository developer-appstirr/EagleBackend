import { add, isAfter, isBefore } from 'date-fns';
import { NextFunction, Response } from 'express';

import { getCustomRepository } from 'typeorm';
import ErrorFactory from '../../libraries/factories/error.factory';
import IUserRequest from '../../libraries/interfaces/request.interface';
import SubscriptionErrors from '../../libraries/mappings/errors/subscription.errors';
import SubscriptionSuccess from '../../libraries/mappings/success/subscription.success';
import sendResponse from '../../libraries/sendResponse.lib';
import UserEntity from '../users/entities/user.entity';
import SubscriptionTypesEnum from './models/subscription-types.enum';
import SubscriptionHistoriesRepository from './repositories/subscription-histories.repository';
import SubscriptionsRepository from './repositories/subscriptions.repository';
import DevicesRepository from '../devices/repositories/devices.repository';

export default class SubscriptionsController {
  getAllSubscriptions = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get subscriptions repository
      const subscriptionsRepository = getCustomRepository(SubscriptionsRepository);

      // get all yearly subscriptions
      const yearlySubscriptions = await subscriptionsRepository.findAllYearlySubscriptions();

      // get all monthly subscriptions
      const monthlySubscriptions = await subscriptionsRepository.findAllMonthlySubscriptions();

      // send response back to user
      sendResponse(res, SubscriptionSuccess.SUBSCRIPTION_GET_SUCCESS, 'Get all subscriptions successfully', {
        yearlySubscriptions,
        monthlySubscriptions,
      });
    } catch (error: any) {
      next(error);
    }
  };

  addSubscription = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get subscriptions repository
      const subscriptionsRepository = getCustomRepository(SubscriptionsRepository);

      const subscription = await subscriptionsRepository.saveSubscription({
        ...req.body,
      });

      // send response back to user
      sendResponse(res, SubscriptionSuccess.SUBSCRIPTION_ADDED_SUCCESS, 'Subscription added successfully', {
        subscription,
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateSubscription = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // get subscriptions repository
      const subscriptionsRepository = getCustomRepository(SubscriptionsRepository);

      const isExist = await subscriptionsRepository.findOne({ id });

      if (!isExist) {
        throw ErrorFactory.getError(SubscriptionErrors.SUBSCRIPTION_DOES_NOT_EXIST);
      }

      // update content filter
      const subscription = await subscriptionsRepository.saveSubscription({
        id,
        ...req.body,
      });

      // send response back to user
      sendResponse(res, SubscriptionSuccess.SUBSCRIPTION_UPDATED_SUCCESS, 'Subscription updated successfully', {
        subscription,
      });
    } catch (error: any) {
      next(error);
    }
  };

  deleteSubscription = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // get subscriptions repository
      const subscriptionsRepository = getCustomRepository(SubscriptionsRepository);

      const isExist = await subscriptionsRepository.findOne({ id });

      if (!isExist) {
        throw ErrorFactory.getError(SubscriptionErrors.SUBSCRIPTION_DOES_NOT_EXIST);
      }

      const subscriptionHistoriesRepository = getCustomRepository(SubscriptionHistoriesRepository);

      const isExistSubcriptionHistory = await subscriptionHistoriesRepository.findOne({ subscription: isExist });

      if (isExistSubcriptionHistory) {
        throw ErrorFactory.getError(SubscriptionErrors.SUBSCRIPTION_IS_ALREADY_IN_USED);
      }

      await subscriptionsRepository.softRemove(isExist);

      // send response back to user
      sendResponse(res, SubscriptionSuccess.SUBSCRIPTION_DELETED_SUCCESS, 'Subscription deleted successfully');
    } catch (error: any) {
      next(error);
    }
  };

  buySubscription = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { subscriptionId, deviceIds } = req.body;

      // get subscriptions repository
      const subscriptionsRepository = getCustomRepository(SubscriptionsRepository);

      const isExistSubscription = await subscriptionsRepository.findById(subscriptionId);

      if (!isExistSubscription) {
        throw ErrorFactory.getError(SubscriptionErrors.SUBSCRIPTION_DOES_NOT_EXIST);
      }

      // get devices repository
      const devicesRepository = getCustomRepository(DevicesRepository);

      const devicesCount = await devicesRepository.countParentDevices(req.user);

      if (deviceIds) {
        if (deviceIds.length > isExistSubscription.deviceLimit) {
          throw ErrorFactory.getError(SubscriptionErrors.SUBSCRIPTION_HAVE_LIMIT_FOR_DEVICE);
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (devicesCount > isExistSubscription.deviceLimit) {
          throw ErrorFactory.getError(SubscriptionErrors.SUBSCRIPTION_HAVE_LIMIT_FOR_DEVICE);
        }
      }

      // get subscriptions history repository
      const subscriptionHistoriesRepository = getCustomRepository(SubscriptionHistoriesRepository);

      const findActiveSubscription = await subscriptionHistoriesRepository.findActiveSubscription(req.user);

      if (findActiveSubscription) {
        if (
          findActiveSubscription.subscription.id !== subscriptionId ||
          isBefore(new Date(findActiveSubscription.expiryDate), new Date())
        ) {
          await subscriptionHistoriesRepository.saveSubscriptionHistory({
            ...findActiveSubscription,
            isActive: false,
          });
        } else {
          throw ErrorFactory.getError(SubscriptionErrors.SUBSCRIPTION_IS_ALREADY_SUBSCRIBED);
        }
      }

      let expiryDate;

      if (isExistSubscription.subscriptionType === SubscriptionTypesEnum.YEARLY) {
        expiryDate = add(new Date(), { years: 1 });
      } else {
        expiryDate = add(new Date(), { months: 1 });
      }

      await subscriptionHistoriesRepository.saveSubscriptionHistory({
        user: req.user as UserEntity,
        subscription: isExistSubscription,
        startDate: new Date(),
        expiryDate,
      });

      if (deviceIds?.length > 0) {
        await devicesRepository.devicesStatusHandling(req.user, deviceIds);
      }
      // send response back to user
      sendResponse(res, SubscriptionSuccess.SUBSCRIPTION_BUYING_SUCCESS, 'Subscription buying successfully', {
        subscription: isExistSubscription,
      });
    } catch (error: any) {
      next(error);
    }
  };

  getAllSubscriptionHistories = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get subscriptions history repository
      const subscriptionHistoriesRepository = getCustomRepository(SubscriptionHistoriesRepository);

      // get all subscription histories
      const subscriptionHistories = await (
        await subscriptionHistoriesRepository.findSubscriptionHistories(req.user)
      ).map((history) => ({
        id: history.id,
        subscriptionTitle: history.subscription.title,
        price: history.subscription.price,
        startDate: history.startDate,
        expiryDate: history.expiryDate,
        status: history.isActive ? isAfter(new Date(history.expiryDate), new Date()) : false,
      }));
      // send response back to user
      sendResponse(res, SubscriptionSuccess.SUBSCRIPTION_HISTORIES_GET_SUCCESS, 'Get all subscription histories', {
        subscriptionHistories,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

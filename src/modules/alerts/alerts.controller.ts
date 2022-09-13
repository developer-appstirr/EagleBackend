import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import IUserRequest from '../../libraries/interfaces/request.interface';
import AlertSuccess from '../../libraries/mappings/success/alert.success';
import sendResponse from '../../libraries/sendResponse.lib';
import AlertsRepository from './repositories/alerts.repository';

export default class AlertsController {
  getAllAlerts = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get alerts repository
      const alertsRepository = getCustomRepository(AlertsRepository);
      // get All alert
      const alerts = await alertsRepository.findAll(req.user, req.query);

      // send response back to user
      sendResponse(res, AlertSuccess.ALERT_GET_SUCCESS, 'Get all alerts successfully', {
        ...alerts,
      });
    } catch (error: any) {
      next(error);
    }
  };

  getAlertUnReadCount = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get alerts repository
      const alertsRepository = getCustomRepository(AlertsRepository);

      const alertCount = await alertsRepository.getUnReadCount(req.user);

      // send response back to user
      sendResponse(res, AlertSuccess.ALERT_GET_SUCCESS, 'Get unread alert count successfully', { alertCount });
    } catch (error: any) {
      next(error);
    }
  };
}

import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import ErrorFactory from '../../libraries/factories/error.factory';
import ChildrenErrors from '../../libraries/mappings/errors/children.errors';
import DeviceErrors from '../../libraries/mappings/errors/device.errors';
import IUserRequest from '../../libraries/interfaces/request.interface';
import DeviceSuccess from '../../libraries/mappings/success/device.success';
import sendResponse from '../../libraries/sendResponse.lib';
import * as Mailer from '../../libraries/mailer.lib';
import DefaultEmailTemplate from '../../libraries/email-template/default-email-template';
import DevicesRepository from './repositories/devices.repository';
import ChildrensRepository from '../childrens/repositories/childrens.repository';
import SubscriptionHistoriesRepository from '../subscriptions/repositories/subscription-histories.repository';
import Configuration from '../../config/index';

export default class DevicesController {
  sendApplicationLink = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get devices repository
      // const devicesRepository = getCustomRepository(DevicesRepository);

      Mailer.sendEmail({
        recipientEmail: req.body.email,
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
                <a href="${Configuration.FIREBASE.BUCKET_URL}app-debug.apk" target="_blank">Download Application </a> 
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
      sendResponse(res, DeviceSuccess.DEVICE_LINK_SENDED_SUCCESS, 'Application link send to device successfully');
    } catch (error: any) {
      next(error);
    }
  };

  childrenDevices = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        params: { childrenId },
        user,
      } = req;

      // get devices repository
      const devicesRepository = getCustomRepository(DevicesRepository);

      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      const isExistChildren = await childrensRepository.findOne({
        id: childrenId,
        user,
      });

      if (!isExistChildren) {
        throw ErrorFactory.getError(ChildrenErrors.CHILDREN_DOES_NOT_EXIST);
      }

      const devices = await devicesRepository.find({
        children: isExistChildren,
      });

      // send response back to user
      sendResponse(res, DeviceSuccess.DEVICE_GET_SUCCESS, ' Get all devices successfully', { devices });
    } catch (error: any) {
      next(error);
    }
  };

  childrenDevicesCount = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        params: { childrenId },
        user,
      } = req;

      // get devices repository
      const devicesRepository = getCustomRepository(DevicesRepository);

      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      const isExistChildren = await childrensRepository.findOne({
        id: childrenId,
        user,
      });

      if (!isExistChildren) {
        throw ErrorFactory.getError(ChildrenErrors.CHILDREN_DOES_NOT_EXIST);
      }

      const devicesCount = await devicesRepository.count({
        children: isExistChildren,
        status: true,
      });

      // send response back to user
      sendResponse(res, DeviceSuccess.DEVICE_GET_SUCCESS, ' Get devices count successfully', { devicesCount });
    } catch (error: any) {
      next(error);
    }
  };

  deleteChildrenDevice = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        params: { id },
        user,
      } = req;

      // get devices repository
      const devicesRepository = getCustomRepository(DevicesRepository);

      const isExistDevice = await devicesRepository.findOne({
        id,
      });

      if (!isExistDevice) {
        throw ErrorFactory.getError(DeviceErrors.DEVICE_DOES_NOT_EXIST);
      }

      await devicesRepository.softRemove({ id });
      // send response back to user
      sendResponse(res, DeviceSuccess.DEVICE_DELETED_SUCCESS, 'Device deleted successfully');
    } catch (error: any) {
      next(error);
    }
  };

  childrenDeviceEnableOrDisable = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        params: { id },
        user,
      } = req;

      // get devices repository
      const devicesRepository = getCustomRepository(DevicesRepository);

      const isExistDevice = await devicesRepository.findOne({
        id,
      });

      if (!isExistDevice) {
        throw ErrorFactory.getError(DeviceErrors.DEVICE_DOES_NOT_EXIST);
      }

      const devicesCount = await devicesRepository.countParentDevices(req.user);

      // get subscriptions history repository
      const subscriptionHistoriesRepository = getCustomRepository(SubscriptionHistoriesRepository);

      const findActiveSubscription = await subscriptionHistoriesRepository.findActiveSubscription(req.user);

      if (!findActiveSubscription || devicesCount >= findActiveSubscription?.subscription.deviceLimit) {
        throw ErrorFactory.getError(DeviceErrors.YOUR_DEVICE_LIMIT_IS_FULL);
      }
      let message;
      if (!isExistDevice.status) {
        message = { key: DeviceSuccess.DEVICE_ENABLE_SUCCESS, message: 'Device enable successfully' };
      } else {
        message = { key: DeviceSuccess.DEVICE_DISABLE_SUCCESS, message: 'Device disable successfully' };
      }
      await devicesRepository.saveDevice({ ...isExistDevice, status: !isExistDevice.status });
      // send response back to user
      sendResponse(res, message.key, message.message);
    } catch (error: any) {
      next(error);
    }
  };
}

import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../users/repositories/users.repository';
import IUserRequest from '../../libraries/interfaces/request.interface';
import AlertSuccess from '../../libraries/mappings/success/alert.success';
import sendResponse from '../../libraries/sendResponse.lib';
import RoleRepository from '../roles/repositories/roles.repository';
import DevicesRepository from '../devices/repositories/devices.repository';
import ChildrensRepository from '../childrens/repositories/childrens.repository';

export default class AdminController {
  getDashboard = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get users repository
      const usersRepository = getCustomRepository(UsersRepository);

      // get role repository
      const rolesRepository = getCustomRepository(RoleRepository);

      // get parent role
      const parentRole = await rolesRepository.findParentRole();

      // Get parents Count
      const users = await usersRepository.count({
        where: {
          role: parentRole,
        },
      });

      // get children repository
      const childrensRepository = getCustomRepository(ChildrensRepository);

      // Get children Count
      const childrens = await childrensRepository.count();

      // get devices repository
      const devicesRepository = getCustomRepository(DevicesRepository);
      const devices = await devicesRepository.count({
        status: true,
      });

      // send response back to user
      sendResponse(res, AlertSuccess.ALERT_GET_SUCCESS, 'Get all alerts successfully', { users, childrens, devices });
    } catch (error: any) {
      next(error);
    }
  };
}

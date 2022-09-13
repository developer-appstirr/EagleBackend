import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import ErrorFactory from '../../libraries/factories/error.factory';
import IUserRequest from '../../libraries/interfaces/request.interface';
import ContentFilterErrors from '../../libraries/mappings/errors/content-filter.errors';
import ContentFilterSuccess from '../../libraries/mappings/success/content-filter.success';
import sendResponse from '../../libraries/sendResponse.lib';
import ContentFiltersRepository from './repositories/content-filters.repository';
import ContentFilterForUsersRepository from './repositories/content-filter-for-users.repository';
import UsersRepository from '../users/repositories/users.repository';
import RolesRepository from '../roles/repositories/roles.repository';
import ContentFilterEntity from './entities/content-filter.entity';

export default class ContentFiltersController {
  getAllContentFilters = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get content filter repository
      const contentFiltersRepository = getCustomRepository(ContentFiltersRepository);
      // get All content filters
      const contentFilters = await contentFiltersRepository.findAll();

      // send response back to user
      sendResponse(res, ContentFilterSuccess.CONTENT_FILTER_GET_SUCCESS, 'Get all content filters successfully', {
        contentFilters,
      });
    } catch (error: any) {
      next(error);
    }
  };

  addContentFilter = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get content filter repository
      const contentFiltersRepository = getCustomRepository(ContentFiltersRepository);
      const contentFilter = await contentFiltersRepository.saveContentFilter({
        ...req.body,
      });

      // get role repository
      const rolesRepository = getCustomRepository(RolesRepository);

      // get user role
      const role = await rolesRepository.findParentRole();

      // get user repository
      const usersRepository = getCustomRepository(UsersRepository);

      // create content filter with parent role
      const users = await usersRepository.findAllParentRoleWise(role);

      // get content filter for users repository
      const contentFilterForUsersRepository = getCustomRepository(ContentFilterForUsersRepository);

      contentFilterForUsersRepository.saveContentFilterForAllUsers(users, contentFilter);
      // send response back to user
      sendResponse(res, ContentFilterSuccess.CONTENT_FILTER_ADDED_SUCCESS, 'Content filter added successfully', {
        contentFilter,
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateContentFilter = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // get content filter repository
      const contentFiltersRepository = getCustomRepository(ContentFiltersRepository);

      const isExist = await contentFiltersRepository.findOne({ id });

      if (!isExist) {
        throw ErrorFactory.getError(ContentFilterErrors.CONTENT_FILTER_DOES_NOT_EXIST);
      }

      // update content filter
      const contentFilter = await contentFiltersRepository.saveContentFilter({
        id,
        ...req.body,
      });

      // send response back to user
      sendResponse(res, ContentFilterSuccess.CONTENT_FILTER_UPDATED_SUCCESS, 'Content filter updated successfully', {
        contentFilter,
      });
    } catch (error: any) {
      next(error);
    }
  };

  deleteContentFilter = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // get content filter repository
      const contentFiltersRepository = getCustomRepository(ContentFiltersRepository);

      // get content filter for users repository
      const contentFilterForUsersRepository = getCustomRepository(ContentFilterForUsersRepository);

      const isExist = await contentFiltersRepository.findOne({ id });

      if (!isExist) {
        throw ErrorFactory.getError(ContentFilterErrors.CONTENT_FILTER_DOES_NOT_EXIST);
      }

      const contentFilterForUsers = await contentFilterForUsersRepository.find({
        contentFilter: isExist,
      });

      await contentFiltersRepository.softRemove(isExist);

      await contentFilterForUsersRepository.softRemove(contentFilterForUsers);

      // send response back to user
      sendResponse(res, ContentFilterSuccess.CONTENT_FILTER_DELETED_SUCCESS, 'Content filter deleted successfully');
    } catch (error: any) {
      next(error);
    }
  };

  getAllParentContentFilters = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get content filter repository
      const contentFilterForUsersRepository = getCustomRepository(ContentFilterForUsersRepository);
      // get All content filters
      const contentFilters = await contentFilterForUsersRepository.findParentContentFilter(req.user);
      // send response back to user
      sendResponse(res, ContentFilterSuccess.CONTENT_FILTER_GET_SUCCESS, 'Get all content filters successfully', {
        contentFilters,
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateParentContentFilter = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // get content filter repository
      const contentFilterForUsersRepository = getCustomRepository(ContentFilterForUsersRepository);

      const isExist = await contentFilterForUsersRepository.findOne({ id, user: req.user });
      if (!isExist) {
        throw ErrorFactory.getError(ContentFilterErrors.CONTENT_FILTER_DOES_NOT_EXIST);
      }

      // update content filter
      const contentFilter = await contentFilterForUsersRepository.saveContentFilterForUser({
        ...isExist,
        ...req.body,
      });

      // send response back to user
      sendResponse(res, ContentFilterSuccess.CONTENT_FILTER_UPDATED_SUCCESS, 'Content filter updated successfully', {
        contentFilter,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

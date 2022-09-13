import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import IUserRequest from '../../libraries/interfaces/request.interface';
import ErrorFactory from '../../libraries/factories/error.factory';
import PageErrors from '../../libraries/mappings/errors/page.errors';

import PageSuccess from '../../libraries/mappings/success/page.success';
import sendResponse from '../../libraries/sendResponse.lib';
import PagesRepository from './repositories/pages.repository';

export default class PagesController {
  getPage = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get pages repository
      const pagesRepository = getCustomRepository(PagesRepository);

      const page = await pagesRepository.findOne({
        where: {
          pageType: req.params.pageType,
        },
      });

      // send response back to user
      sendResponse(res, PageSuccess.PAGE_GET_SUCCESS, 'Get all pages successfully', page);
    } catch (error: any) {
      next(error);
    }
  };

  updatePage = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get pages repository
      const pagesRepository = getCustomRepository(PagesRepository);

      const isExist = await pagesRepository.findOne({
        where: { pageType: req.params.pageType },
      });

      if (!isExist) {
        throw ErrorFactory.getError(PageErrors.PAGE_DOES_NOT_EXIST);
      }

      const page = await pagesRepository.savePage({
        ...isExist,
        ...req.body,
      });

      // send response back to user
      sendResponse(res, PageSuccess.PAGE_UPDATED_SUCCESS, 'Page updated successfully', {
        page,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

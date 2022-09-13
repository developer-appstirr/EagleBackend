import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import IUserRequest from '../../libraries/interfaces/request.interface';
import ErrorFactory from '../../libraries/factories/error.factory';
import FAQErrors from '../../libraries/mappings/errors/faqs.errors';

import FAQSuccess from '../../libraries/mappings/success/faq.success ';
import sendResponse from '../../libraries/sendResponse.lib';
import FAQsRepository from './repositories/faqs.repository';

export default class FAQsController {
  getAllFaqs = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get Faqs repository
      const faqsRepository = getCustomRepository(FAQsRepository);

      const pages = await faqsRepository.findAll(req.query);

      // send response back to user
      sendResponse(res, FAQSuccess.FAQ_GET_SUCCESS, 'Get all pages successfully', pages);
    } catch (error: any) {
      next(error);
    }
  };

  addFaq = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get Faqs repository
      const faqsRepository = getCustomRepository(FAQsRepository);

      const subscription = await faqsRepository.saveFaq({
        ...req.body,
      });

      // send response back to user
      sendResponse(res, FAQSuccess.FAQ_CREATE_SUCCESS, 'FAQ added successfully', {
        subscription,
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateFaq = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      // get Faqs repository
      const faqsRepository = getCustomRepository(FAQsRepository);

      const isExist = await faqsRepository.findOne({
        where: { id },
      });

      if (!isExist) {
        throw ErrorFactory.getError(FAQErrors.FAQ_DOES_NOT_EXIST);
      }

      const faq = await faqsRepository.saveFaq({
        ...isExist,
        ...req.body,
      });

      // send response back to user
      sendResponse(res, FAQSuccess.FAQ_UPDATED_SUCCESS, 'FAQ updated successfully', {
        faq,
      });
    } catch (error: any) {
      next(error);
    }
  };

  deleteFaq = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // get Faqs repository
      const faqsRepository = getCustomRepository(FAQsRepository);

      const isExist = await faqsRepository.findOne({ id });

      if (!isExist) {
        throw ErrorFactory.getError(FAQErrors.FAQ_DOES_NOT_EXIST);
      }

      await faqsRepository.softRemove(isExist);

      // send response back to user
      sendResponse(res, FAQSuccess.FAQ_DELETED_SUCCESS, 'FAQ deleted successfully');
    } catch (error: any) {
      next(error);
    }
  };
}

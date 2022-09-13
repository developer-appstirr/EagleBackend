import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import IUserRequest from '../../libraries/interfaces/request.interface';
import ContactUsSuccess from '../../libraries/mappings/success/contact-us.success';
import sendResponse from '../../libraries/sendResponse.lib';
import ContactUsRepository from './repositories/contact-us.repository';

export default class ContactUsController {
  getAllContactUs = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get contact us repository
      const contactUsRepository = getCustomRepository(ContactUsRepository);

      const contactUs = await contactUsRepository.findAll(req.query);

      // send response back to user
      sendResponse(res, ContactUsSuccess.CONTACT_US_GET_SUCCESS, 'Get all contact us successfully', contactUs);
    } catch (error: any) {
      next(error);
    }
  };

  createContactUs = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // get contact us repository
      const contactUsRepository = getCustomRepository(ContactUsRepository);

      const contactUs = await contactUsRepository.saveContactUs({
        ...req.body,
      });

      // send response back to user
      sendResponse(res, ContactUsSuccess.CONTACT_US_ADDED_SUCCESS, 'Contact us added successfully', {
        contactUs,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

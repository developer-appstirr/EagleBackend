import { NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import IUserRequest from '../../libraries/interfaces/request.interface';
import ChatSuccess from '../../libraries/mappings/success/chat.success';
import sendResponse from '../../libraries/sendResponse.lib';
import UsersRepository from '../users/repositories/users.repository';
import ChatsRepository from './repositories/chats.repository';

export default class ScreenTimesController {
  getAllChats = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { userId } = req.query;

      // get users repository
      const usersRepository = getCustomRepository(UsersRepository);

      const admin = await usersRepository.findAdmin();

      userId = userId || admin?.id;

      // get chats repository
      const chatsRepository = getCustomRepository(ChatsRepository);
      // get All chats
      const chats = await chatsRepository.findAll(req.user, userId, req.query);

      // send response back to user
      sendResponse(res, ChatSuccess.CHAT_GET_SUCCESS, 'Get all chats successfully', chats);
    } catch (error: any) {
      next(error);
    }
  };

  getAllChatHeads = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, query } = req;
      // get users repository
      const usersRepository = getCustomRepository(UsersRepository);

      const users = await usersRepository.findAllUserHeads(user, query);

      // send response back to user
      sendResponse(res, ChatSuccess.CHAT_HEAD_GET_SUCCESS, 'Get all chat heads successfully', users);
    } catch (error: any) {
      next(error);
    }
  };
}

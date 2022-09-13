import { EntityRepository, In } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';

import ChatEntity from '../entities/chat.entity';
import UserEntity from '../../users/entities/user.entity';

@EntityRepository(ChatEntity)
export default class ChatsRepository extends BaseRepository<ChatEntity> {
  saveChat(chat: Partial<ChatEntity>): Promise<ChatEntity> {
    return this.save(new ChatEntity({ ...chat }));
  }

  async findAll(user: UserEntity, userId: any, { page = 1, limit = 10 }) {
    const take = limit > 100 ? 100 : limit;
    const total = await this.count({
      where: {
        sender: In([user.id, userId]),
        receiver: In([user.id, userId]),
      },
    });
    const chats = await this.find({
      loadRelationIds: true,
      where: {
        sender: In([user.id, userId]),
        receiver: In([user.id, userId]),
      },
      order: {
        createdAt: 'DESC',
      },
      take,
      skip: (page - 1) * take,
    });

    return {
      chats: chats.reverse(),
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }
}

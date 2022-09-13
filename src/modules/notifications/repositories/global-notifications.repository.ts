import { EntityRepository, In } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';

import GlobalNotificationEntity from '../entities/global-notifications.entity';

@EntityRepository(GlobalNotificationEntity)
export default class GlobalNotificationsRepository extends BaseRepository<GlobalNotificationEntity> {
  saveNotification(notification: Partial<GlobalNotificationEntity>) {
    return this.save(new GlobalNotificationEntity({ ...notification }));
  }

  async findAllGlobalNotifications({ page = 1, limit = 10 }) {
    const take = limit > 100 ? 100 : limit;
    const total = await this.count();
    const notifications = await this.find({
      order: {
        createdAt: 'DESC',
      },
      take,
      skip: (page - 1) * take,
    });

    return {
      notifications,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }
}

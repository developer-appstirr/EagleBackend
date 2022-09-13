import { EntityRepository, In } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';

import NotificationEntity from '../entities/notification.entity';
import UserEntity from '../../users/entities/user.entity';

@EntityRepository(NotificationEntity)
export default class NotificationsRepository extends BaseRepository<NotificationEntity> {
  async findAll(user: UserEntity, { page = 1, limit = 10 }) {
    const take = limit > 100 ? 100 : limit;
    const total = await this.count();
    const notifications = await this.find({
      where: {
        user,
      },
      order: {
        createdAt: 'DESC',
      },
      take,
      skip: (page - 1) * take,
    });

    this.markIsRead(notifications);

    return {
      notifications,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async findAllGlobalNotifications({ page = 1, limit = 10 }) {
    const take = limit > 100 ? 100 : limit;
    const total = await this.count();
    const notifications = await this.createQueryBuilder('noti')
      .groupBy('noti.title')
      .orderBy('noti.createdAt', 'DESC')
      .take(take)
      .skip((page - 1) * take)
      .getMany();

    return {
      notifications,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async markIsRead(alerts: Array<NotificationEntity>) {
    const ids = alerts.map((alert) => alert.id);
    this.update({ id: In(ids) }, { isRead: true });
  }

  getUnReadCount(user: UserEntity) {
    return this.count({
      where: [{ user }, { isRead: false }],
    });
  }

  storeMany(notification: Partial<NotificationEntity>, users: UserEntity[]) {
    const data = users.map((user) => {
      return new NotificationEntity({
        title: notification.title,
        body: notification.body,
        user,
      });
    });
    return this.save(data);
  }
}

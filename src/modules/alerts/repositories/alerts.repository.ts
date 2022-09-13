import { EntityRepository, In } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';

import AlertEntity from '../entities/alert.entity';
import UserEntity from '../../users/entities/user.entity';

@EntityRepository(AlertEntity)
export default class AlertsRepository extends BaseRepository<AlertEntity> {
  async findAll(user: UserEntity, { page = 1, limit = 10 }) {
    const take = limit > 100 ? 100 : limit;
    const total = await this.count();
    const alerts = await this.find({
      where: {
        user,
      },
      order: {
        createdAt: 'DESC',
      },
      take,
      skip: (page - 1) * take,
    });

    this.markIsRead(alerts);

    return {
      alerts,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async markIsRead(alerts: Array<AlertEntity>) {
    const ids = alerts.map((alert) => alert.id);
    this.update({ id: In(ids) }, { isRead: true });
  }

  getUnReadCount(user: UserEntity) {
    return this.count({
      where: [{ user }, { isRead: false }],
    });
  }
}

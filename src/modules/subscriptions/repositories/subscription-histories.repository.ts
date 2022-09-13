import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import SubscriptionHistoryEntity from '../entities/subscription-history.entity';
import UserEntity from '../../users/entities/user.entity';

@EntityRepository(SubscriptionHistoryEntity)
export default class SubscriptionHistoriesRepository extends BaseRepository<SubscriptionHistoryEntity> {
  findSubscriptionHistories(user: UserEntity): Promise<Array<SubscriptionHistoryEntity>> {
    return this.find({
      where: { user },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  saveSubscriptionHistory(subscriptionHistory: Partial<SubscriptionHistoryEntity>): Promise<SubscriptionHistoryEntity> {
    return this.save(new SubscriptionHistoryEntity({ ...subscriptionHistory }));
  }

  findActiveSubscription(user: Partial<UserEntity>): Promise<SubscriptionHistoryEntity | undefined> {
    return this.findOne({
      where: { user, isActive: true },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}

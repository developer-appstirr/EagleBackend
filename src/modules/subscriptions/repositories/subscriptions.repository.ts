import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import SubscriptionEntity from '../entities/subscription.entity';
import SubscriptionTypesEnum from '../models/subscription-types.enum';

@EntityRepository(SubscriptionEntity)
export default class SubscriptionsRepository extends BaseRepository<SubscriptionEntity> {
  saveSubscription(subscription: Partial<SubscriptionEntity>): Promise<SubscriptionEntity> {
    return this.save(new SubscriptionEntity({ ...subscription }));
  }

  findAllYearlySubscriptions(): Promise<Array<SubscriptionEntity>> {
    return this.find({
      where: { subscriptionType: SubscriptionTypesEnum.YEARLY, status: true },
      select: ['id', 'subscriptionType', 'title', 'subTitle', 'description', 'deviceLimit', 'price', 'createdAt'],
    });
  }

  findAllMonthlySubscriptions(): Promise<Array<SubscriptionEntity>> {
    return this.find({
      where: { subscriptionType: SubscriptionTypesEnum.MONTHLY, status: true },
      select: ['id', 'subscriptionType', 'title', 'subTitle', 'description', 'deviceLimit', 'price', 'createdAt'],
    });
  }
}

import { Column, Entity } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import SubscriptionTypesEnum from '../models/subscription-types.enum';

@Entity('subscriptions')
export default class SubscriptionEntity extends BaseEntity<SubscriptionEntity> {
  @Column({ type: 'enum', enum: SubscriptionTypesEnum, nullable: false, name: 'subscription_type' })
  subscriptionType!: string;

  @Column({ nullable: false }) title!: string;

  @Column({ nullable: false, type: 'text' }) subTitle!: string;

  @Column({ nullable: false, type: 'text' }) description!: string;

  @Column({ type: 'int2', nullable: false }) deviceLimit!: number;

  @Column({ type: 'float', nullable: false }) price!: number;

  @Column({ default: true, nullable: false }) status!: boolean;

  constructor(entity: Partial<SubscriptionEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

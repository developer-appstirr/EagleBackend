import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import UserEntity from '../../users/entities/user.entity';
import SubscriptionEntity from './subscription.entity';

@Entity('subscription-histories')
export default class SubscriptionHistoryEntity extends BaseEntity<SubscriptionHistoryEntity> {
  @Column({ type: 'jsonb', nullable: false })
  subscription!: SubscriptionEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    nullable: false,
    cascade: ['soft-remove', 'remove'],
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'start_date', nullable: false, type: 'date' }) startDate!: Date;

  @Column({ name: 'expiry_date', nullable: false, type: 'date' }) expiryDate!: Date;

  @Column({ name: 'is_active', nullable: false, default: true }) isActive!: boolean;

  constructor(entity: Partial<SubscriptionHistoryEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

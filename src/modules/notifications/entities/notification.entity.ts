import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import UserEntity from '../../users/entities/user.entity';

@Entity('notifications')
export default class NotificationEntity extends BaseEntity<NotificationEntity> {
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false, cascade: ['soft-remove', 'remove'] })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ nullable: false, type: 'text' })
  title!: string;

  @Column({ nullable: false, type: 'text' })
  body!: string;

  @Column({ default: false, name: 'is_read' }) isRead!: boolean;

  constructor(entity: Partial<NotificationEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

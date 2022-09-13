import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import UserEntity from '../../users/entities/user.entity';

@Entity('screen-times')
export default class ScreenTimeEntity extends BaseEntity<ScreenTimeEntity> {
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false, cascade: ['soft-remove', 'remove'] })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ nullable: false }) rulename!: string;

  @Column({ nullable: false, type: 'timetz' })
  from!: string;

  @Column({ nullable: false, type: 'timetz' })
  to!: string;

  constructor(entity: Partial<ScreenTimeEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

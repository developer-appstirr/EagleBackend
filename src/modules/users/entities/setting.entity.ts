import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import UserEntity from './user.entity';

@Entity('settings')
export default class SettingEntity extends BaseEntity<SettingEntity> {
  @OneToOne(() => UserEntity, { nullable: false, cascade: ['soft-remove', 'remove'] })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ default: true }) notification!: boolean;

  constructor(entity: Partial<SettingEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

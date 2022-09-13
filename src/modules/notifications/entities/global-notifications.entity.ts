import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import UserEntity from '../../users/entities/user.entity';

@Entity('global-notifications')
export default class GlobalEntity extends BaseEntity<GlobalEntity> {
  @Column({ nullable: false, type: 'text' })
  title!: string;

  @Column({ nullable: false, type: 'text' })
  body!: string;

  constructor(entity: Partial<GlobalEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

import { Column, Entity, OneToMany } from 'typeorm';

import UserEntity from '../../users/entities/user.entity';

import BaseEntity from '../../../libraries/entities/base.entity';
import RoleEnum from '../models/roles.enum';

@Entity('roles')
export default class RoleEntity extends BaseEntity<RoleEntity> {
  @Column({ type: 'enum', enum: RoleEnum, unique: true }) name!: RoleEnum;

  @OneToMany(() => UserEntity, (user) => user.id)
  users!: UserEntity;

  constructor(entity: Partial<RoleEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

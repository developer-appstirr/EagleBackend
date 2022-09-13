import * as _ from 'lodash';

import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import RoleEntity from '../../roles/entities/role.entity';
import UserEntity from '../../users/entities/user.entity';
import BaseEntity from '../../../libraries/entities/base.entity';
import { hashCompare, hashString } from '../../../libraries/bycrpt';
import ScreenTimeForChildrenEntity from '../../screen-times/entities/screen-time-for-children.entity';
import DeviceEntity from '../../devices/entities/device.entity';

@Entity('childrens')
export default class ChildernEntity extends BaseEntity<ChildernEntity> {
  @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @OneToOne(() => ScreenTimeForChildrenEntity, (screenTimeForChildren) => screenTimeForChildren.children)
  screenTimeForChildren!: ScreenTimeForChildrenEntity;

  @OneToMany(() => DeviceEntity, (device) => device.children)
  device!: DeviceEntity;

  @Column({ nullable: false }) firstname!: string;

  @Column({ nullable: false }) lastname!: string;

  @Column({ nullable: false, unique: true }) username!: string;

  @Column({ nullable: true }) password!: string;

  @Column({ default: 'users/profile.png', name: 'image_url' }) imageUrl!: string;

  @Column({ name: 'date_of_birth', nullable: false, type: 'date' })
  dateOfBirth!: Date;

  @Column({ nullable: false, unique: true, name: 'qr_code', type: 'text' }) qrCode!: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) this.password = await hashString(this.password);
  }

  validatePassword(password: string): boolean {
    return hashCompare(password, this.password);
  }

  childrenSanitize(): Partial<ChildernEntity> {
    const data = _.omit(this, ['password']);
    return data;
  }

  constructor(entity: Partial<ChildernEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

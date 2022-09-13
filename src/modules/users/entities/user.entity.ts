import * as _ from 'lodash';

import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import RoleEntity from '../../roles/entities/role.entity';
import CodeVerficationEntity from '../../auth/entities/code-verification.entity';
import ChildernEntity from '../../childrens/entities/children.entity';
import { hashCompare, hashString } from '../../../libraries/bycrpt';
import LoginTypesEnum from '../models/login-type.enum';
import SettingEntity from './setting.entity';
import ScreenTimeEntity from '../../screen-times/entities/screen-time.entity';
import ChatEntity from '../../chats/entities/chat.entity';
import SubscriptionHistoryEntity from '../../subscriptions/entities/subscription-history.entity';

@Entity('users')
export default class UserEntity extends BaseEntity<UserEntity> {
  @OneToMany(() => CodeVerficationEntity, (code) => code.user)
  code!: CodeVerficationEntity;

  @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @OneToMany(() => ChildernEntity, (child) => child.user)
  children!: ChildernEntity;

  @OneToOne(() => SettingEntity, (setting) => setting.user)
  setting!: SettingEntity;

  @OneToOne(() => SubscriptionHistoryEntity, (subs) => subs.user)
  subscription!: SubscriptionHistoryEntity;

  @OneToMany(() => ScreenTimeEntity, (screenTime) => screenTime.user)
  screenTime!: ScreenTimeEntity;

  @OneToMany(() => ChatEntity, (chat) => chat.sender)
  sender!: ChatEntity;

  @OneToMany(() => ChatEntity, (chat) => chat.receiver)
  receiver!: ChatEntity;

  @Column({ nullable: false, unique: true }) email!: string;

  @Column({ nullable: false }) fullname!: string;

  @Column({ nullable: true }) password!: string;

  @Column({ nullable: true }) phone!: string;

  @Column({ default: false, name: 'is_verified' }) isVerified!: boolean;

  @Column({ default: 'users/profile.png', name: 'image_url' }) imageUrl!: string;

  @Column({ type: 'enum', enum: LoginTypesEnum, default: LoginTypesEnum.DEFAULT, nullable: false, name: 'login_type' })
  loginType!: string;

  @Column({ nullable: true, name: 'device_token' }) deviceToken!: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) this.password = await hashString(this.password);
  }

  validatePassword(password: string): boolean {
    return hashCompare(password, this.password);
  }

  userSanitize(): Partial<UserEntity> {
    const data = _.omit(this, ['password', 'isVerified', 'deletedAt']);
    return data;
  }

  constructor(entity: Partial<UserEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

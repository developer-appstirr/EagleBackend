import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import ContentFilterEntity from './content-filter.entity';
import UserEntity from '../../users/entities/user.entity';

@Entity('content-filter-for-users')
export default class ContentFilterForUserEntity extends BaseEntity<ContentFilterForUserEntity> {
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false, cascade: ['soft-remove', 'remove'] })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => ContentFilterEntity, (contentFilter) => contentFilter.id, {
    nullable: false,
    cascade: ['soft-remove', 'remove'],
  })
  @JoinColumn({ name: 'content_filter_id' })
  contentFilter!: ContentFilterEntity;

  @Column({ default: false }) status!: boolean;

  @Column({ default: false }) alert!: boolean;

  constructor(entity: Partial<ContentFilterForUserEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

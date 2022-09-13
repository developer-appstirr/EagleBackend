import { Column, Entity } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';

@Entity('app-filterings')
export default class AppFilteringEntity extends BaseEntity<AppFilteringEntity> {
  @Column({ nullable: false, unique: true }) name!: string;

  @Column({ type: 'text', nullable: false }) thumbnail!: string;

  @Column({ type: 'boolean', nullable: false }) isActive!: string;

  constructor(entity: Partial<AppFilteringEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

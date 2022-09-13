import { Column, Entity } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';

@Entity('content-filters')
export default class ContentFilterEntity extends BaseEntity<ContentFilterEntity> {
  @Column({ nullable: false }) name!: string;

  constructor(entity: Partial<ContentFilterEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

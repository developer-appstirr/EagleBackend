import { Column, Entity } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';

@Entity('faqs')
export default class FAQEntity extends BaseEntity<FAQEntity> {
  @Column({ nullable: false, type: 'text' }) question!: string;

  @Column({ nullable: false, type: 'text' }) answer!: string;

  constructor(entity: Partial<FAQEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

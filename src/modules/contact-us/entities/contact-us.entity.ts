import { Column, Entity } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';

@Entity('contact-us')
export default class ContactUsEntity extends BaseEntity<ContactUsEntity> {
  @Column({ nullable: false }) email!: string;

  @Column({ nullable: false }) phone!: string;

  @Column({ nullable: false }) subject!: string;

  @Column({ nullable: false, type: 'text' }) message!: string;

  constructor(entity: Partial<ContactUsEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

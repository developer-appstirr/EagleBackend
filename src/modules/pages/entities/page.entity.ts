import { Column, Entity } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import PageTypesEnum from '../models/page-types.enum';

@Entity('pages')
export default class PageEntity extends BaseEntity<PageEntity> {
  @Column({ type: 'enum', enum: PageTypesEnum, nullable: false, unique: true }) pageType!: PageTypesEnum;

  @Column({ nullable: false }) title!: string;

  @Column({ nullable: false, type: 'text' }) content!: string;

  constructor(entity: Partial<PageEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

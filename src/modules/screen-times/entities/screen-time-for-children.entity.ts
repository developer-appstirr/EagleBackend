import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import ChildernEntity from '../../childrens/entities/children.entity';
import ScreenTimeEntity from './screen-time.entity';

@Entity('screen-times-for-childrens')
export default class ScreenTimeForChildrenEntity extends BaseEntity<ScreenTimeForChildrenEntity> {
  @OneToOne(() => ChildernEntity, { nullable: false, cascade: ['soft-remove', 'remove'] })
  @JoinColumn({ name: 'children_id' })
  children!: ChildernEntity;

  @ManyToOne(() => ScreenTimeEntity, { nullable: false, cascade: ['soft-remove', 'remove'] })
  @JoinColumn({ name: 'screen_time_id' })
  screenTime!: ScreenTimeEntity;

  constructor(entity: Partial<ScreenTimeForChildrenEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

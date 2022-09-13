import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import DeviceTypeEnum from '../models/device-type.enum';
import ChildernEntity from '../../childrens/entities/children.entity';

@Entity('devices')
export default class DeviceEntity extends BaseEntity<DeviceEntity> {
  @ManyToOne(() => ChildernEntity, { nullable: false, cascade: ['soft-remove', 'remove'] })
  @JoinColumn({ name: 'children_id' })
  children!: ChildernEntity;

  @Column({ nullable: false, name: 'device_name' }) deviceName!: string;

  @Column({ type: 'enum', enum: DeviceTypeEnum, nullable: false, name: 'device_type' }) deviceType!: DeviceTypeEnum;

  @Column({ nullable: false, name: 'imei_number' }) imeiNumber!: string;

  @Column({ nullable: false }) version!: string;

  @Column({ nullable: false, type: 'float', default: 0.0 }) latitude!: number;

  @Column({ nullable: false, type: 'float', default: 0.0 }) longitude!: number;

  @Column({ default: false, nullable: false }) status!: boolean;

  constructor(entity: Partial<DeviceEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

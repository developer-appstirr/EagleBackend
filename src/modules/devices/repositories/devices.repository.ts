import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import DeviceEntity from '../entities/device.entity';
import UserEntity from '../../users/entities/user.entity';

@EntityRepository(DeviceEntity)
export default class DevicesRepository extends BaseRepository<DeviceEntity> {
  async countParentDevices(user: UserEntity) {
    return this.createQueryBuilder('devices')
      .leftJoinAndSelect('devices.children', 'children')
      .where('children.user = :user', { user: user.id })
      .getCount();
  }

  saveDevice(device: any): Promise<DeviceEntity> {
    return this.save(new DeviceEntity({ ...device }));
  }

  getAllDevices(user: Partial<UserEntity>): Promise<DeviceEntity[]> {
    return this.find({
      relations: ['children', 'children.user'],
      where: { 'children.user.id': user.id },
    });
  }

  async devicesStatusHandling(user: Partial<UserEntity>, deviceIds: Array<string>): Promise<DeviceEntity[]> {
    const devices = await this.getAllDevices(user);

    const mapData = devices.map((device) => {
      const findData = deviceIds.find((deviceId) => device.id === deviceId);

      return new DeviceEntity({
        ...device,
        status: !!findData,
      });
    });
    return this.save(mapData);
  }
}

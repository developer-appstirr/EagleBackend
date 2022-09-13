import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import SettingEntity from '../entities/setting.entity';
import UserEntity from '../entities/user.entity';

@EntityRepository(SettingEntity)
export default class SettingsRepository extends BaseRepository<SettingEntity> {
  saveSetting(user: UserEntity) {
    return this.save(new SettingEntity({ user }));
  }
}

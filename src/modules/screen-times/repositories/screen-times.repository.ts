import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';

import ScreenTimeEntity from '../entities/screen-time.entity';
import UserEntity from '../../users/entities/user.entity';

@EntityRepository(ScreenTimeEntity)
export default class ScreenTimesRepository extends BaseRepository<ScreenTimeEntity> {
  saveScreenTime(screenTime: any): Promise<ScreenTimeEntity> {
    return this.save(new ScreenTimeEntity({ ...screenTime }));
  }

  findAll(user: UserEntity): Promise<Array<ScreenTimeEntity>> {
    return this.find({
      where: { user },
      select: ['id', 'rulename', 'from', 'to'],
    });
  }
}

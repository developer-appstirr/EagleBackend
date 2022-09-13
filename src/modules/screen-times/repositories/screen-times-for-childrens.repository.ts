import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';

import ScreenTimeEntity from '../entities/screen-time.entity';
import ScreenTimeForChildrenEntity from '../entities/screen-time-for-children.entity';

@EntityRepository(ScreenTimeForChildrenEntity)
export default class ScreenTimesForChildrensRepository extends BaseRepository<ScreenTimeForChildrenEntity> {
  saveScreenTimeForChildren(
    isExistScreenTimeForChildren: string | undefined,
    screenTimeForChildren: any,
  ): Promise<ScreenTimeForChildrenEntity> {
    if (!isExistScreenTimeForChildren) {
      return this.save(new ScreenTimeForChildrenEntity({ ...screenTimeForChildren }));
    }
    return this.save(new ScreenTimeForChildrenEntity({ ...screenTimeForChildren, id: isExistScreenTimeForChildren }));
  }
}

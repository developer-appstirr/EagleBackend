import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import AppFilteringEntity from '../entities/app-filtering.entity';

@EntityRepository(AppFilteringEntity)
export default class AppFilteringRepository extends BaseRepository<AppFilteringEntity> {
  saveAppFiltering(appFiltrer: Partial<AppFilteringEntity>) {
    return this.save(new AppFilteringEntity({ ...appFiltrer }));
  }

  async findAll(filter: any) {
    const appsFilter = await this.find({
      order: {
        createdAt: 'DESC',
      },
      where: filter,
    });

    return appsFilter;
  }
}

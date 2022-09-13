import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import ContentFilterEntity from '../entities/content-filter.entity';

@EntityRepository(ContentFilterEntity)
export default class ContentFiltersRepository extends BaseRepository<ContentFilterEntity> {
  saveContentFilter(contentFilter: any): Promise<ContentFilterEntity> {
    return this.save(new ContentFilterEntity({ ...contentFilter }));
  }

  findAll(): Promise<Array<ContentFilterEntity>> {
    return this.find({
      select: ['id', 'name', 'createdAt'],
    });
  }
}

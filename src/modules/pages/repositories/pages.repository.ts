import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import PageEntity from '../entities/page.entity';

@EntityRepository(PageEntity)
export default class PagesRepository extends BaseRepository<PageEntity> {
  savePage(contact: Partial<PageEntity>): Promise<PageEntity> {
    return this.save(new PageEntity({ ...contact }));
  }

  async findAll({ search = '', page = 1, limit = 10 }) {
    const take = limit > 100 ? 100 : limit;
    const total = await this.count();
    const pages = await this.find({
      order: {
        createdAt: 'DESC',
      },
      take,
      skip: (page - 1) * take,
    });

    return {
      pages,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }
}

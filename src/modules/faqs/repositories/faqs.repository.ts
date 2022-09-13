import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import FAQEntity from '../entities/faq.entity';

@EntityRepository(FAQEntity)
export default class FAQsRepository extends BaseRepository<FAQEntity> {
  saveFaq(contact: Partial<FAQEntity>): Promise<FAQEntity> {
    return this.save(new FAQEntity({ ...contact }));
  }

  async findAll({ page = 1, limit = 10 }) {
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

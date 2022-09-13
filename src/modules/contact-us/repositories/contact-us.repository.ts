import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import ContactUsEntity from '../entities/contact-us.entity';

@EntityRepository(ContactUsEntity)
export default class ContactUsRepository extends BaseRepository<ContactUsEntity> {
  saveContactUs(contact: Partial<ContactUsEntity>): Promise<ContactUsEntity> {
    return this.save(new ContactUsEntity({ ...contact }));
  }

  async findAll({ search = '', page = 1, limit = 10 }) {
    const take = limit > 100 ? 100 : limit;
    const total = await this.count();
    const contactUs = await this.find({
      order: {
        createdAt: 'DESC',
      },
      take,
      skip: (page - 1) * take,
    });

    return {
      contactUs,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }
}

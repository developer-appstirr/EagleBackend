import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import ContentFilterForUserEntity from '../entities/content-filter-for-user.entity';
import UserEntity from '../../users/entities/user.entity';
import ContentFilterEntity from '../entities/content-filter.entity';

@EntityRepository(ContentFilterForUserEntity)
export default class ContentFilterForUsersRepository extends BaseRepository<ContentFilterForUserEntity> {
  async findParentContentFilter(user: UserEntity): Promise<Array<ContentFilterForUserEntity>> {
    return this.createQueryBuilder('contentFilterForUser')
      .leftJoinAndSelect('contentFilterForUser.contentFilter', 'contentFilter')
      .where('contentFilterForUser.user = :user', { user: user.id })
      .select([
        'contentFilterForUser.id',
        'contentFilterForUser.status',
        'contentFilterForUser.alert',
        'contentFilterForUser.createdAt',
        'contentFilter.id',
        'contentFilter.name',
      ])
      .getMany();
  }

  saveContentFilterForUser(
    contentFilterForUserEntity: ContentFilterForUserEntity,
  ): Promise<ContentFilterForUserEntity> {
    return this.save(new ContentFilterForUserEntity({ ...contentFilterForUserEntity }));
  }

  saveContentFiltersForUser(
    user: UserEntity,
    contentFilters: Array<ContentFilterEntity>,
  ): Promise<Array<ContentFilterForUserEntity>> {
    const data = contentFilters.map((contentFilter) => {
      return new ContentFilterForUserEntity({
        contentFilter,
        user,
      });
    });
    return this.save(data);
  }

  saveContentFilterForAllUsers(
    users: Array<UserEntity>,
    contentFilter: ContentFilterEntity,
  ): Promise<Array<ContentFilterForUserEntity>> {
    const data = users.map((user) => {
      return new ContentFilterForUserEntity({
        contentFilter,
        user,
      });
    });

    return this.save(data);
  }
}

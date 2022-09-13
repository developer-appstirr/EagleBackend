import { EntityRepository, Brackets, Not } from 'typeorm';
import BaseRepository from '../../../libraries/repositories/base.repository';
import RoleEnum from '../../roles/models/roles.enum';
import RoleEntity from '../../roles/entities/role.entity';
import UserEntity from '../entities/user.entity';

@EntityRepository(UserEntity)
export default class UsersRepository extends BaseRepository<UserEntity> {
  saveUser(user: Partial<UserEntity>) {
    return this.save(new UserEntity({ ...user }));
  }

  findAllParentRoleWise(role: RoleEntity | undefined) {
    return this.find({ role });
  }

  findAdmin() {
    return this.createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .where('role.name = :role', { role: RoleEnum.ADMIN })
      .getOne();
  }

  async getUsersDeviceTokens({ subscription = null, dateFrom = null, dateTo = null, search = '' }) {
    let users: any = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.children', 'children')
      .leftJoinAndSelect(
        'user.subscription',
        'subscription',
        'subscription.user = user.id AND subscription.isActive = true',
      )
      .leftJoinAndSelect('children.device', 'device')
      .andWhere(`role.name != :role`, { role: RoleEnum.ADMIN })
      .andWhere(
        new Brackets((qb) => {
          qb.where('fullname ILIKE :fullname', { fullname: `%${search}%` }).orWhere('email ILIKE :email', {
            email: `%${search}%`,
          });
        }),
      )
      .select([
        'user',
        'subscription.startDate',
        'subscription.expiryDate',
        'subscription.isActive',
        'subscription.subscription',
      ])
      .orderBy('user.createdAt', 'DESC');
    if (dateFrom && dateTo) {
      users = users
        .andWhere('user.createdAt >= :dateFrom', { dateFrom })
        .andWhere('user.createdAt < :dateTo', { dateTo });
    }

    if (subscription && subscription === 'EXPIRED') {
      users = users.andWhere('subscription.expiryDate < :date', {
        date: new Date(),
      });
    }

    if (subscription && subscription !== 'EXPIRED') {
      users = users.andWhere('subscription.subscription ::jsonb @> :subscription', {
        subscription: { subscriptionType: subscription },
      });
    }

    users = await users.getMany();

    return users;
  }

  async findAllUserHeads(user: UserEntity, { search = '', page = 1, limit = 10 }) {
    const take = limit > 100 ? 100 : limit;
    const total = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.isVerified = true')
      .andWhere(`role.name != :role`, { role: RoleEnum.ADMIN })
      .andWhere('user.fullname ILIKE :name', { name: `%${search}%` })
      .getCount();
    const usersFindAll = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.isVerified = true')
      .andWhere(`role.name != :role`, { role: RoleEnum.ADMIN })
      .andWhere('user.fullname ILIKE :name', { name: `%${search}%` })
      .loadRelationCountAndMap('user.unReadCount', 'user.sender', 'sender', (qb) =>
        qb.andWhere('sender.receiver = :userId', { userId: user.id }).andWhere('sender.isRead = false'),
      )
      // .leftJoinAndSelect('user.sender', 'sender')
      // .orderBy('sender.createdAt', 'DESC')

      .orderBy('user.createdAt', 'DESC')
      .take(take)
      .skip((page - 1) * take)
      .getMany();
    const users = usersFindAll.map((usr: any) => ({
      id: usr.id,
      email: usr.email,
      fullname: usr.fullname,
      phone: usr.phone,
      imageUrl: usr.imageUrl,
      unReadCount: usr.unReadCount,
      createdAt: usr.createdAt,
      updatedAt: usr.updatedAt,
    }));

    return {
      users,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async findAllUserManagement({
    subscription = null,
    dateFrom = null,
    dateTo = null,
    search = '',
    page = 1,
    limit = 10,
  }) {
    const take = limit > 100 ? 100 : limit;
    let total: any = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.children', 'children')
      .leftJoinAndSelect(
        'user.subscription',
        'subscription',
        'subscription.user = user.id AND subscription.isActive = true',
      )
      .leftJoinAndSelect('children.device', 'device')
      .andWhere(`role.name != :role`, { role: RoleEnum.ADMIN })
      .andWhere(
        new Brackets((qb) => {
          qb.where('fullname ILIKE :fullname', { fullname: `%${search}%` }).orWhere('email ILIKE :email', {
            email: `%${search}%`,
          });
        }),
      );

    let users: any = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.children', 'children')
      .leftJoinAndSelect(
        'user.subscription',
        'subscription',
        'subscription.user = user.id AND subscription.isActive = true',
      )
      .leftJoinAndSelect('children.device', 'device')
      .andWhere(`role.name != :role`, { role: RoleEnum.ADMIN })
      .andWhere(
        new Brackets((qb) => {
          qb.where('fullname ILIKE :fullname', { fullname: `%${search}%` }).orWhere('email ILIKE :email', {
            email: `%${search}%`,
          });
        }),
      )
      .select([
        'user.id',
        'user.email',
        'user.fullname',
        'user.phone',
        'user.isVerified',
        'user.imageUrl',
        'user.createdAt',
        'children.firstname',
        'children.lastname',
        'children.username',
        'children.imageUrl',
        'children.dateOfBirth',
        'device',
        'subscription.startDate',
        'subscription.expiryDate',
        'subscription.isActive',
        'subscription.subscription',
      ])
      .orderBy('user.createdAt', 'DESC');
    if (dateFrom && dateTo) {
      users = users
        .andWhere('user.createdAt >= :dateFrom', { dateFrom })
        .andWhere('user.createdAt < :dateTo', { dateTo });
      total = total
        .andWhere('user.createdAt >= :dateFrom', { dateFrom })
        .andWhere('user.createdAt < :dateTo', { dateTo });
    }

    if (subscription && subscription === 'EXPIRED') {
      users = users.andWhere('subscription.expiryDate < :date', {
        date: new Date(),
      });

      total = total.andWhere('subscription.expiryDate < :date', {
        date: new Date(),
      });
    }

    if (subscription && subscription !== 'EXPIRED') {
      users = users.andWhere('subscription.subscription ::jsonb @> :subscription', {
        subscription: { subscriptionType: subscription },
      });
      total = total.andWhere('subscription.subscription ::jsonb @> :subscription', {
        subscription: { subscriptionType: subscription },
      });
    }

    users = await users
      .take(take)
      .skip((page - 1) * take)
      .getMany();

    total = await total.getCount();

    return {
      users,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async findAllUsersWithOutPagination({ subscription = null, dateFrom = null, dateTo = null, search = '' }) {
    let users: any = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.children', 'children')
      .leftJoinAndSelect(
        'user.subscription',
        'subscription',
        'subscription.user = user.id AND subscription.isActive = true',
      )
      .leftJoinAndSelect('children.device', 'device')
      .andWhere(`role.name != :role`, { role: RoleEnum.ADMIN })
      .andWhere(
        new Brackets((qb) => {
          qb.where('fullname ILIKE :fullname', { fullname: `%${search}%` }).orWhere('email ILIKE :email', {
            email: `%${search}%`,
          });
        }),
      )
      .select([
        'user.id',
        'user.email',
        'user.fullname',
        'user.phone',
        'user.isVerified',
        'user.imageUrl',
        'user.createdAt',
        'children.firstname',
        'children.lastname',
        'children.username',
        'children.imageUrl',
        'children.dateOfBirth',
        'device',
        'subscription.startDate',
        'subscription.expiryDate',
        'subscription.isActive',
        'subscription.subscription',
      ])
      .orderBy('user.createdAt', 'DESC');
    if (dateFrom && dateTo) {
      users = users
        .andWhere('user.createdAt >= :dateFrom', { dateFrom })
        .andWhere('user.createdAt < :dateTo', { dateTo });
    }

    if (subscription && subscription === 'EXPIRED') {
      users = users.andWhere('subscription.expiryDate < :date', {
        date: new Date(),
      });
    }

    if (subscription && subscription !== 'EXPIRED') {
      users = users.andWhere('subscription.subscription ::jsonb @> :subscription', {
        subscription: { subscriptionType: subscription },
      });
    }

    users = await users.getMany();

    return { users };
  }
}

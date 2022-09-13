import { EntityRepository } from 'typeorm';
import RoleEntity from '../entities/role.entity';
import RoleEnum from '../models/roles.enum';
import BaseRepository from '../../../libraries/repositories/base.repository';

@EntityRepository(RoleEntity)
export default class RoleRepository extends BaseRepository<RoleEntity> {
  findParentRole(): Promise<RoleEntity | undefined> {
    return this.findOne({ name: RoleEnum.PARENT });
  }

  findChildrenRole(): Promise<RoleEntity | undefined> {
    return this.findOne({ name: RoleEnum.CHILDREN });
  }
}

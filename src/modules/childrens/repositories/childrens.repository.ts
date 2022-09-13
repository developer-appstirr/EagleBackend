import { EntityRepository } from 'typeorm';
import UserEntity from '../../users/entities/user.entity';
import BaseRepository from '../../../libraries/repositories/base.repository';

import ChildernEntity from '../entities/children.entity';

@EntityRepository(ChildernEntity)
export default class ChildrensRepository extends BaseRepository<ChildernEntity> {
  saveChildren(children: any): Promise<ChildernEntity> {
    return this.save(new ChildernEntity({ ...children }));
  }

  findAll(user: UserEntity): Promise<Array<ChildernEntity>> {
    return this.find({
      where: { user },
      relations: ['screenTimeForChildren', 'screenTimeForChildren.screenTime'],
      select: ['id', 'firstname', 'lastname', 'username', 'dateOfBirth', 'imageUrl', 'qrCode', 'screenTimeForChildren'],
    });
  }
}

import { EntityRepository } from 'typeorm';
import { addMinutes } from 'date-fns';

import BaseRepository from '../../../libraries/repositories/base.repository';

import CodeVerficationEntity from '../entities/code-verification.entity';

import UserEntity from '../../users/entities/user.entity';

import CodeVerficationsEnum from '../models/code-verifications.enum';

@EntityRepository(CodeVerficationEntity)
export default class CodeVerficationsRepository extends BaseRepository<CodeVerficationEntity> {
  async saveCodeVerification(codeVerfications: CodeVerficationEntity): Promise<void> {
    await this.save(new CodeVerficationEntity({ ...codeVerfications }));
  }

  async saveCodeVerifications(user: UserEntity, code: number): Promise<void> {
    await this.save([
      {
        user,
        codeType: CodeVerficationsEnum.VERIFICATION,
        code,
        expireTime: addMinutes(new Date(), 5),
      },

      {
        user,
        codeType: CodeVerficationsEnum.FORGOT_PASSWORD,
      },
    ]);
  }

  async updateCodeVerifications(
    user: UserEntity,
    codeType: CodeVerficationsEnum.FORGOT_PASSWORD | CodeVerficationsEnum.VERIFICATION,
    code: number,
  ): Promise<void> {
    await this.update(
      { user, codeType },
      {
        codeType,
        code,
        expireTime: addMinutes(new Date(), 5),
      },
    );
  }

  async findVerifyAccount(
    email: string,
    codeType: CodeVerficationsEnum.FORGOT_PASSWORD | CodeVerficationsEnum.VERIFICATION,
  ): Promise<CodeVerficationEntity | undefined> {
    const codeVerify = await this.createQueryBuilder('code')
      .leftJoinAndSelect('code.user', 'user')
      .where('user.email = :email', { email })
      .andWhere('code.code_type = :codeType', { codeType })
      .getOne();

    return codeVerify;
  }

  async findAccountForChangePassword(
    token: string,
    codeType = CodeVerficationsEnum.FORGOT_PASSWORD,
  ): Promise<CodeVerficationEntity | undefined> {
    const codeVerify = await this.createQueryBuilder('code')
      .leftJoinAndSelect('code.user', 'user')
      .where('code.token = :token', { token })
      .andWhere('code.code_type = :codeType', { codeType })
      .getOne();
    return codeVerify;
  }
}

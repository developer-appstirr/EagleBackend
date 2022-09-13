import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';

import CodeVerficationsEnum from '../models/code-verifications.enum';
import UserEntity from '../../users/entities/user.entity';

@Entity('code_verfications')
export default class CodeVerficationEntity extends BaseEntity<CodeVerficationEntity> {
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false, cascade: ['soft-remove', 'remove'] })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ type: 'int4', nullable: true }) code!: number | null;

  @Column({ type: 'timestamp', name: 'expire_time', nullable: true }) expireTime!: Date;

  @Column({ type: 'enum', enum: CodeVerficationsEnum, nullable: false, name: 'code_type' })
  codeType!: CodeVerficationsEnum;

  @Column({ type: 'varchar', nullable: true }) token!: string | null;

  constructor(entity: Partial<CodeVerficationEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../../../libraries/entities/base.entity';
import UserEntity from '../../users/entities/user.entity';
import MessageEnum from '../models/message.enum';

@Entity('chats')
export default class ChatEntity extends BaseEntity<ChatEntity> {
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false, cascade: ['soft-remove', 'remove'] })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false, cascade: ['soft-remove', 'remove'] })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @Column({ nullable: false }) message: string;

  @Column({ name: 'message_type', nullable: false, default: MessageEnum.TEXT })
  messageType: MessageEnum;

  @Column({ default: false, name: 'is_read' }) isRead!: boolean;

  constructor(entity: Partial<ChatEntity>) {
    super(entity);
    Object.assign(this, entity);
  }
}

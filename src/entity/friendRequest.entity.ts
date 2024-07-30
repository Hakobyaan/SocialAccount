import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('friend_requests')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.sentRequests)
  requester: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedRequests)
  receiver: UserEntity;

  @Column()
  status: 'pending' | 'accepted' | 'declined';
}

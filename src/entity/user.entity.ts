import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FriendRequestEntity } from './friendRequest.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  age: number;

  @OneToMany(() => FriendRequestEntity, (request) => request.requester)
  sentRequests: FriendRequestEntity[];

  @OneToMany(() => FriendRequestEntity, (request) => request.receiver)
  receivedRequests: FriendRequestEntity[];
}

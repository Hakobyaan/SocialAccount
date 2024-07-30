import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { FriendRequestEntity } from '../entity/friendRequest.entity';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async search(
    firstName?: string,
    lastName?: string,
    age?: number,
  ): Promise<UserEntity[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (firstName) {
      queryBuilder.andWhere('user.firstName = :firstName', { firstName });
    }

    if (lastName) {
      queryBuilder.andWhere('user.lastName = :lastName', { lastName });
    }

    if (age) {
      queryBuilder.andWhere('user.age = :age', { age });
    }

    return queryBuilder.getMany();
  }

  async findOne(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async addFriend(
    requesterId: number,
    receiverId: number,
  ): Promise<FriendRequestEntity> {
    const friendRequest = new FriendRequestEntity();
    friendRequest.requester = await this.findOneById(requesterId);
    friendRequest.receiver = await this.findOneById(receiverId);
    friendRequest.status = 'pending';
    return this.friendRequestRepository.save(friendRequest);
  }

  async getFriendRequests(userId: number): Promise<FriendRequestEntity[]> {
    return this.friendRequestRepository.find({
      where: { receiver: { id: userId }, status: 'pending' },
      relations: ['requester', 'receiver'],
    });
  }

  async respondToFriendRequest(
    requestId: number,
    status: 'accepted' | 'declined',
  ): Promise<void> {
    await this.friendRequestRepository.update(requestId, { status });
  }
}

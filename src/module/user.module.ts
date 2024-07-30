import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { UserController } from '../controller/user.controller';
import { UserEntity } from '../entity/user.entity';
import { FriendRequestEntity } from '../entity/friendRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FriendRequestEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

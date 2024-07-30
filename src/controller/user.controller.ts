import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/user.dto';
import { ResponseUtil } from '../utils/response.util';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ status: string; message: string; data: any }> {
    const user = await this.userService.create(createUserDto);
    return ResponseUtil.success(user, 'User registered successfully');
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users' })
  @ApiResponse({ status: 200, description: 'Users found.' })
  async search(
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('age') age?: number,
  ): Promise<{ status: string; message: string; data: any }> {
    const users = await this.userService.search(firstName, lastName, age);
    return ResponseUtil.success(users, 'Users found');
  }

  @Post('friend-request/:id')
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({ status: 201, description: 'Friend request sent.' })
  async sendFriendRequest(
    @Param('id') id: number,
    @Body('userId') userId: number,
  ): Promise<{ status: string; message: string; data: any }> {
    const friendRequest = await this.userService.addFriend(userId, id);
    return ResponseUtil.success(friendRequest, 'Friend request sent');
  }

  @Get('friend-requests')
  @ApiOperation({ summary: 'Get friend requests' })
  @ApiResponse({ status: 200, description: 'Friend requests retrieved.' })
  async getFriendRequests(
    @Query('userId') userId: number,
  ): Promise<{ status: string; message: string; data: any }> {
    const requests = await this.userService.getFriendRequests(userId);
    return ResponseUtil.success(requests, 'Friend requests retrieved');
  }

  @Patch('friend-request/:id')
  @ApiOperation({ summary: 'Respond to a friend request' })
  @ApiResponse({ status: 200, description: 'Friend request responded to.' })
  async respondToFriendRequest(
    @Param('id') id: number,
    @Body('status') status: 'accepted' | 'declined',
  ): Promise<{ status: string; message: string; data: any }> {
    await this.userService.respondToFriendRequest(id, status);
    return ResponseUtil.success(null, `Friend request ${status}`);
  }
}

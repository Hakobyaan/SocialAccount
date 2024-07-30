import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/auth.dto';
import { ResponseUtil } from '../utils/response.util';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user and return JWT tokens' })
  @ApiResponse({
    status: 200,
    description: 'Successful login with JWT tokens.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<{
    status: string;
    message: string;
    data: { access_token: string; refresh_token: string };
  }> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new Error('User not found');
    }
    const tokens = await this.authService.login(user);
    return ResponseUtil.success(tokens);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'New access token.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(200)
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto): Promise<{
    status: string;
    message: string;
    data: { access_token: string; refresh_token: string };
  }> {
    const tokens = await this.authService.refreshTokens(
      refreshTokenDto.refresh_token,
    );
    return ResponseUtil.success(tokens);
  }
}

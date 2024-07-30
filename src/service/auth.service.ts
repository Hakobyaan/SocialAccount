import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../entity/user.entity';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    this.accessTokenExpiration = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION',
    );
    this.refreshTokenExpiration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findOne(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(
    user: UserEntity,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiration,
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.refreshTokenExpiration,
    });

    return { access_token, refresh_token };
  }

  async refreshTokens(
    refresh_token: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(refresh_token);
      const user = await this.userService.findOneById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      const new_access_token = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: this.accessTokenExpiration },
      );
      const new_refresh_token = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: this.refreshTokenExpiration },
      );

      return {
        access_token: new_access_token,
        refresh_token: new_refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

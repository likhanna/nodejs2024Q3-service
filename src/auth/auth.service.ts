import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { decode } from 'jsonwebtoken';

import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: CreateUserDto): Promise<User> {
    const newUser = await this.userService.create(dto);
    return newUser;
  }

  async login({ login, password }: CreateUserDto) {
    const user = await this.getAuthenticatedUser(login, password);

    const payload: JwtPayload = { userId: user.id, login: user.login };
    const tokens = this.generateTokens(payload);
    return { ...payload, ...tokens };
  }

  public async refreshToken(dto: RefreshTokenDto) {
    const { refreshToken } = dto;
    console.log('refreshToken', refreshToken);
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        maxAge: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });

      const payload = decode(refreshToken, { json: true });
      const tokens = this.generateTokens({
        userId: payload.userId,
        login: payload.login,
      });

      return { ...payload, ...tokens };
    } catch (err) {
      throw new ForbiddenException('Wrong credentials provided');
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private generateTokens(payload: JwtPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_KEY,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      }),
    };
  }

  async getAuthenticatedUser(
    login: string,
    plainTextPassword: string,
  ): Promise<User> {
    try {
      const user = await this.userService.findOneByLogin(login);

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `User with such login = ${login} was not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.verifyPassword(plainTextPassword, user.password);

      return user;
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials provided');
    }
  }

  async validateToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_KEY,
    });

    return payload;
  }
}

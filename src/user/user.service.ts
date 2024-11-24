import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const { login, password } = dto;
    const now = Date.now();

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.CRYPT_SALT) || 10,
    );

    const newUser = this.userRepository.create({
      login: login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async findAll(): Promise<User[]> {
    const users: User[] = await this.userRepository.find();

    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `User with id = ${id} does not exist`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findOneByLogin(login: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { login } });
    return user;
  }

  async update(id: string, dto: UpdatePasswordDto): Promise<User> {
    const { oldPassword, newPassword } = dto;
    const user = await this.findOne(id);

    const isPasswordMatching = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatching) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'oldPassword is wrong',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    user.password = newPassword;
    user.updatedAt = Date.now();
    user.version++;

    await this.userRepository.save(user);

    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.delete({ id: user.id });
  }
}

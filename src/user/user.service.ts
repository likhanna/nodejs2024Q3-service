import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private readonly userRepository: User[] = [];

  create(dto: CreateUserDto): User {
    const { login, password } = dto;
    const now = Date.now();

    const newUser = new User({
      id: uuidv4(),
      login: login,
      password: password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });

    this.userRepository.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.userRepository;
  }

  findOne(id: string): User {
    const user = this.userRepository.find((it) => it.id === id);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  update(id: string, dto: UpdatePasswordDto): User {
    const { oldPassword, newPassword } = dto;
    const user = this.findOne(id);

    if (user.password !== oldPassword) {
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

    return user;
  }

  remove(id: string): void {
    const user = this.findOne(id);
    const index = this.userRepository.findIndex((it) => it.id === user.id);
    this.userRepository.splice(index, 1);
  }
}

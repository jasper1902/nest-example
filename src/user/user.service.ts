import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RegisterDto } from './dto/registerDto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/userResponseDto';
import { ErrorDto } from './dto/errorDto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}
  async register(
    createUserDto: RegisterDto,
  ): Promise<{ user: UserResponseDto } | ErrorDto> {
    try {
      const userAlreadyRegistered = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username: createUserDto.username },
            { email: createUserDto.email },
          ],
        },
      });

      if (userAlreadyRegistered) {
        return { message: 'User already registered' };
      }

      const hashPassword = await bcrypt.hash(createUserDto.password, 12);
      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: hashPassword,
        },
      });

      return { user: this.responseUser(user) };
    } catch (error) {
      throw {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    }
  }

  responseUser(user: Prisma.UserCreateInput): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
      bio: user.bio,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email: email } });
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RegisterDto } from './dto/registerDto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/userResponseDto';
import { ErrorDto } from './dto/errorDto';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}
  async register(
    createUserDto: RegisterDto,
  ): Promise<{ user: UserResponseDto } | ErrorDto> {
    try {
      const sanitizedUsername = createUserDto.username.replace(/\s/g, '');
      const sanitizedEmail = createUserDto.email.replace(/\s/g, '');
      const sanitizedPassword = createUserDto.password.replace(/\s/g, '');
      if (
        sanitizedUsername !== createUserDto.username ||
        sanitizedEmail !== createUserDto.email ||
        sanitizedPassword !== createUserDto.password
      ) {
        throw new BadRequestException(
          'Username, email, or password cannot contain spaces',
        );
      }

      const hashPassword = await bcrypt.hash(sanitizedPassword, 12);
      const user = await this.prisma.user.create({
        data: {
          username: sanitizedUsername,
          email: sanitizedEmail,
          password: hashPassword,
        },
      });

      return { user: this.responseUser(user) };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(['email or username taken']);
        }
      }

      if (error.response.statusCode === 400) {
        throw new BadRequestException([error.response.message]);
      }

      console.log(error)

      throw new InternalServerErrorException(['Internal Server Error']);
    }
  }

  responseUser(user: Prisma.UserUncheckedCreateInput): UserResponseDto {
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


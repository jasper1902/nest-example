import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/user/dto/userResponseDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(
    email: string,
    password: string,
  ): Promise<{ user: UserResponseDto }> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return { user: this.userService.responseUser(user) };
    }
    return null;
  }

  async login(userDto: {
    user: UserResponseDto;
  }): Promise<{ user: UserResponseDto }> {
    const { email, id } = userDto.user;
    const accessToken = this.jwtService.sign({ email, sub: id });
    userDto.user.accessToken = accessToken;
    return userDto;
  }
}

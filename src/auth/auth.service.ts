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

  async googleLogin(req): Promise<any> {
    if (!req.user) {
      throw new Error('Google login failed: No user information received.');
    }

    const { email, name, picture, googleId } = req.user;
    const userAlreadyRegistered = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userAlreadyRegistered) {
      const payload = { email: userAlreadyRegistered.email };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        username: name,
        image: picture,
        googleId,
      },
    });

    const payload = { email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

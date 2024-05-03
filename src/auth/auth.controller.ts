import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';

import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const user = await this.authService.login(req.user);
    // return user;
    res.cookie('accessToken', user.user.accessToken, {
      httpOnly: true,
    });

    return {
      message: 'Login successful',
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Request() req) {
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Request() req, @Res({passthrough: true}) res: Response) {
    const { accessToken } = await this.authService.googleLogin(req);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });
    res.redirect('/user/profile');
  }
}

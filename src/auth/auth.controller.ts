import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
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
}

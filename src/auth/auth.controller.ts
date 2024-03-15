import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    return req.user;
  }

  @Post('register')
  async register(
    @Body() body: { username: string; pass: string },
  ): Promise<any> {
    const { username, pass } = body;
    return this.authService.createUser(username, pass);
  }
}

import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() body: { username: string; password: string },
  ): Promise<any> {
    const { username, password } = body;
    return this.authService.createUser(username, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async current(@Request() req): Promise<any> {
    return req.user;
  }
}

import { Get, UseGuards } from '@nestjs/common';
import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public-route.decorator';
import { UserEntity } from '../entities/person/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @Get('profile')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getProfile(@Request() req): Promise<UserEntity> {
    return req.user;
  }
}

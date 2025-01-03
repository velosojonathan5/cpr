import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity, UserStatusEnum } from '../entities/person/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findOneByEmail(username);

    if (user.status !== UserStatusEnum.ACTIVE) return null;

    if (
      user &&
      (await this.usersService.compareHashPassword(pass, user.password))
    ) {
      user.password = undefined;
      return user;
    }
    return null;
  }

  async login(user: UserEntity): Promise<{ access_token: string }> {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

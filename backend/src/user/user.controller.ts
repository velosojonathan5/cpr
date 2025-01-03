import { Controller, Body, Post } from '@nestjs/common';
import { Public } from '../auth/public-route.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserEntity } from 'src/entities/person/user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(createUserDto);
  }
}

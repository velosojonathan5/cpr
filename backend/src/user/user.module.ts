import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from './repository/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'KEY_REPOSITORY_USER',
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}

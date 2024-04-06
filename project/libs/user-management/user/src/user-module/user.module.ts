import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/authentication';
import { UserCoreModule } from '@project/user-core';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [UserCoreModule, AuthenticationModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

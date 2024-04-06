import { Module } from '@nestjs/common';
import { BcryptCrypto } from '@project/shared-helpers';
import { UserCoreModule } from '@project/user-core';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

const SALT_ROUNDS = 10;

@Module({
  imports: [UserCoreModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: 'CryptoProtocol',
      useFactory: () => new BcryptCrypto(SALT_ROUNDS),
    },
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}

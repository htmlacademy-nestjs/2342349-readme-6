import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { BcryptCrypto } from '@project/shared-helpers';
import { ApplicationConfig } from '@project/user-config';
import { UserCoreModule } from '@project/user-core';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [UserCoreModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: 'CryptoProtocol',
      useFactory: (applicationConfig: ConfigType<typeof ApplicationConfig>) => new BcryptCrypto(applicationConfig.passwordSaltRounds),
      inject: [ApplicationConfig.KEY]
    },
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}

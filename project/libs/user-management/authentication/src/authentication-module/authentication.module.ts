import { Module } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BcryptCrypto } from '@project/shared-helpers';
import { ApplicationConfig, getJwtOptions } from '@project/user-config';
import { UserCoreModule } from '@project/user-core';
import { NotifyModule } from '@project/user-notify';
import { JwtAccessStrategy } from '../strategy/jwt-access.strategy';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    UserCoreModule, NotifyModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    })
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: 'CryptoProtocol',
      useFactory: (applicationConfig: ConfigType<typeof ApplicationConfig>) => new BcryptCrypto(applicationConfig.passwordSaltRounds),
      inject: [ApplicationConfig.KEY]
    },
    JwtAccessStrategy
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}

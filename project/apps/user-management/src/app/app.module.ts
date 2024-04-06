import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/authentication';
import { UserModule } from '@project/user';

@Module({
  imports: [
    UserModule,
    AuthenticationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

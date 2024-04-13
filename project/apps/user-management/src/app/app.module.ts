import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from '@project/authentication';
import { UserModule } from '@project/user';
import { getMongooseOptions, UserConfigModule } from '@project/user-config';

@Module({
  imports: [
    UserModule,
    AuthenticationModule,
    UserConfigModule,
    MongooseModule.forRootAsync(
      getMongooseOptions()
    )
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

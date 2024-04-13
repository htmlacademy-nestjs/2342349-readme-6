import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mongoConfig from './configurations/mongodb.config';
import appConfig from './configurations/app.config';

const ENV_USER_MANAGEMENT_FILE_PATH = 'apps/user-management/user-app.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, mongoConfig],
      envFilePath: ENV_USER_MANAGEMENT_FILE_PATH
    }),
  ]
})
export class UserConfigModule {}

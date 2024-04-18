import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './configurations/app.config';

const ENV_NOTIFICATION_MANAGEMENT_FILE_PATH = 'apps/notification-management/notification-app.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      envFilePath: ENV_NOTIFICATION_MANAGEMENT_FILE_PATH
    }),
  ]
})
export class NotificationConfigModule {}

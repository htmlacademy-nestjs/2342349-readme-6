import { Module } from '@nestjs/common';
import { NotificationConfigModule } from '@project/notification-config';

@Module({
  imports: [
    NotificationConfigModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

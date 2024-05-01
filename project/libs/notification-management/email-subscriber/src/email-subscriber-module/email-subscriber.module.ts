import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { NotificationCoreModule } from '@project/notification-core';
import { SearchModule } from '@project/search';
import { getRabbitMQOptions } from '@project/shared-helpers';
import { EmailModule } from '../email-module/email.module';
import { EmailSubscriberRabbitController } from './controller/email-subscriber-rabbit.controller';
import { EmailSubscriberRestController } from './controller/email-subscriber-rest.controller';
import { EmailSubscriberService } from './email-subscriber.service';

@Module({
  imports: [
    NotificationCoreModule,
    EmailModule,
    SearchModule,
    RabbitMQModule.forRootAsync(
      RabbitMQModule,
      getRabbitMQOptions('rabbit')
    ),
  ],
  controllers: [EmailSubscriberRabbitController, EmailSubscriberRestController],
  providers: [EmailSubscriberService]
})
export class EmailSubscriberModule {}

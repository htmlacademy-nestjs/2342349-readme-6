import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailScheduleRepository, EmailSubscriberEntity, EmailSubscriberRepository } from '@project/notification-core';
import { SearchService } from '@project/search';
import { EmailService } from '../email-module/email.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { PostNotificationRdo } from './rdo/post-notification.rdo';

@Injectable()
export class EmailSubscriberService {
  private readonly logger = new Logger(EmailSubscriberService.name);

  constructor(
    @Inject('EmailSubscriberRepository') private readonly emailSubscriberRepository: EmailSubscriberRepository,
    @Inject('EmailScheduleRepository') private readonly emailScheduleRepository: EmailScheduleRepository,
    private readonly emailService: EmailService,
    private readonly searchService: SearchService
  ) {
  }

  private async addSubscriber(subscriber: CreateSubscriberDto): Promise<EmailSubscriberEntity> {
    this.logger.log(`Creating new subscriber with email: ${subscriber.email}`);

    const existSubscriber = await this.emailSubscriberRepository.findByEmail(subscriber.email);
    if (existSubscriber) {
      this.logger.log(`Subscriber already exists with email: ${subscriber.email}`);
      return existSubscriber;
    }

    try {
      const emailSubscriber = new EmailSubscriberEntity(subscriber);
      const savedSubscriber = await this.emailSubscriberRepository.save(emailSubscriber);
      this.logger.log(`New subscriber created successfully with email: ${subscriber.email}`);
      return savedSubscriber;
    } catch (error) {
      this.logger.error(`Failed to create subscriber with email: ${subscriber.email}`, error.stack);
      throw error;
    }
  }

  public async processNewSubscriber(subscriber: CreateSubscriberDto): Promise<void> {
    try {
      await this.addSubscriber(subscriber);
      await this.emailService.sendNotifyNewSubscriberEmail(subscriber);
      this.logger.log(`Processed new subscriber email for: ${subscriber.email} successfully`);
    } catch (error) {
      this.logger.error(`Failed to process new subscriber email for: ${subscriber.email}`, error.stack);
    }
  }

  public async processChangePassword(subscriber: ChangePasswordDto): Promise<void> {
    try {
      await this.emailService.sendChangePasswordEmail(subscriber);
      this.logger.log(`Processed change password email for: ${subscriber.email} successfully`);
    } catch (error) {
      this.logger.error(`Failed to process change password email for: ${subscriber.email}`, error.stack);
    }
  }

  public async findPostsForNotification(userId: string): Promise<PostNotificationRdo> {
    try {
      let lastPostDate = await this.emailScheduleRepository.getLastSubscriptionPostDate();
      if (!lastPostDate) {
        lastPostDate = new Date(0);
      }
      this.logger.log(`Processed new post notifications for ${lastPostDate} date`);

      //todo searchService from API
      const foundPostPagination = await this.searchService.findNewPostsByDate(userId, lastPostDate);
      const foundPosts = foundPostPagination.entities;
      this.logger.log(`Found ${foundPosts.length} new posts`);

      const subscribers = await this.emailSubscriberRepository.getAllSubscribers();
      this.logger.log(`Found ${subscribers.length} subscribers`);

      await this.emailService.sendNewPostListEmail(subscribers, foundPosts, lastPostDate);

      return {
        postCount: foundPosts.length,
        userCount: subscribers.length,
        lastPostDate: lastPostDate
      };
    } catch (error) {
      this.logger.error(`Failed to process new post notifications`, error.stack);
    }
  }
}

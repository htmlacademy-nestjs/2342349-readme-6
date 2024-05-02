import { Controller, HttpStatus, Logger, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailSubscriberService } from '../email-subscriber.service';
import { PostNotificationRdo } from '../rdo/post-notification.rdo';

@ApiTags('notifications')
@Controller('notifications')
export class EmailSubscriberRestController {
  private readonly logger = new Logger(EmailSubscriberRestController.name);

  constructor(
    private readonly emailSubscriberService: EmailSubscriberService
  ) {}

  @Post('new-post/:userId')
  @ApiOperation({ summary: 'Send Emails for new posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Emails for new posts sent successfully', type: [PostNotificationRdo] })
  public async getPersonalFeedPosts(
    @Param('userId') userId: string,
  ): Promise<PostNotificationRdo> {
    this.logger.log(`Initiating email notifications for new posts for user ${userId}`);
    //todo userId from token
    return await this.emailSubscriberService.findPostsForNotification(userId);
  }
}

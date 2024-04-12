import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [ContentCoreModule],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}

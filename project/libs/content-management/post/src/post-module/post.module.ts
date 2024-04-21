import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [ContentCoreModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}

import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { LinkPostController } from './link-post.controller';
import { LinkPostService } from './link-post.service';

@Module({
  imports: [ContentCoreModule],
  controllers: [LinkPostController],
  providers: [LinkPostService],
  exports: [LinkPostService]
})
export class LinkPostModule {}

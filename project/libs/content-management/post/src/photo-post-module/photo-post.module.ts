import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { PhotoPostController } from './photo-post.controller';
import { PhotoPostService } from './photo-post.service';

@Module({
  imports: [ContentCoreModule],
  controllers: [PhotoPostController],
  providers: [PhotoPostService],
  exports: [PhotoPostService]
})
export class PhotoPostModule {}

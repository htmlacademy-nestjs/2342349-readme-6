import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { TextPostController } from './text-post.controller';
import { TextPostService } from './text-post.service';

@Module({
  imports: [ContentCoreModule],
  controllers: [TextPostController],
  providers: [TextPostService],
  exports: [TextPostService]
})
export class TextPostModule {}

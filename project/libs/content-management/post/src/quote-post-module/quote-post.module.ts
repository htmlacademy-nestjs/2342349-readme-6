import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { QuotePostController } from './quote-post.controller';
import { QuotePostService } from './quote-post.service';

@Module({
  imports: [ContentCoreModule],
  controllers: [QuotePostController],
  providers: [QuotePostService],
  exports: [QuotePostService]
})
export class QuotePostModule {}

import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [ContentCoreModule],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}

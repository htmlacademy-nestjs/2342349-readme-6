import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  imports: [ContentCoreModule],
  controllers: [LikeController],
  providers: [LikeService]
})
export class LikeModule {}

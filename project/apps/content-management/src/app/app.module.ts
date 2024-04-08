import { Module } from '@nestjs/common';
import { CommentModule } from '@project/comment';
import { LikeModule } from '@project/like';
import {
  LinkPostModule,
  PhotoPostModule,
  PostModule,
  QuotePostModule,
  TextPostModule,
  VideoPostModule
} from '@project/post';
import { SearchModule } from '@project/search';

@Module({
  imports: [
    PostModule,
    LinkPostModule,
    PhotoPostModule,
    QuotePostModule,
    TextPostModule,
    VideoPostModule,
    CommentModule,
    SearchModule,
    LikeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

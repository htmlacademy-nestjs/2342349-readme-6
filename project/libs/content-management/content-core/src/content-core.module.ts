import { Module } from '@nestjs/common';
import { CommentFactory } from './entity/comment/comment.factory';
import { LinkPostFactory } from './entity/link/link-post.factory';
import { PhotoPostFactory } from './entity/photo/photo-post.factory';
import { QuotePostFactory } from './entity/quote/quote-post.factory';
import { TextPostFactory } from './entity/text/text-post.factory';
import { VideoPostFactory } from './entity/video/video-post.factory';
import { CommentMemoryRepository } from './repository/comment/comment-memory.repository';
import { LinkPostMemoryRepository } from './repository/link/link-post-memory.repository';
import { PhotoPostMemoryRepository } from './repository/photo/photo-post-memory.repository';
import { QuotePostMemoryRepository } from './repository/quote/quote-post-memory.repository';
import { TextPostMemoryRepository } from './repository/text/text-post-memory.repository';
import { VideoPostMemoryRepository } from './repository/video/video-post-memory.repository';

@Module({
  providers: [
    {
      provide: 'CommentRepository',
      useFactory: () => new CommentMemoryRepository(new CommentFactory()),
    },
    CommentFactory,
    {
      provide: 'LinkPostRepository',
      useFactory: () => new LinkPostMemoryRepository(new LinkPostFactory()),
    },
    LinkPostFactory,
    {
      provide: 'PhotoPostRepository',
      useFactory: () => new PhotoPostMemoryRepository(new PhotoPostFactory()),
    },
    PhotoPostFactory,
    {
      provide: 'QuotePostRepository',
      useFactory: () => new QuotePostMemoryRepository(new QuotePostFactory()),
    },
    QuotePostFactory,
    {
      provide: 'TextPostRepository',
      useFactory: () => new TextPostMemoryRepository(new TextPostFactory()),
    },
    TextPostFactory,
    {
      provide: 'VideoPostRepository',
      useFactory: () => new VideoPostMemoryRepository(new VideoPostFactory()),
    },
    VideoPostFactory,
  ],
  exports: [
    'CommentRepository', CommentFactory,
    'LinkPostRepository', LinkPostFactory,
    'PhotoPostRepository', PhotoPostFactory,
    'QuotePostRepository', QuotePostFactory,
    'TextPostRepository', TextPostFactory,
    'VideoPostRepository', VideoPostFactory,
  ],
})
export class ContentCoreModule {}

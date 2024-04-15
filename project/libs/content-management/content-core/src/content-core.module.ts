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
      useFactory: (commentFactory: CommentFactory) => new CommentMemoryRepository(commentFactory),
      inject: [CommentFactory]
    },
    CommentFactory,
    {
      provide: 'LinkPostRepository',
      useFactory: (linkPostFactory: LinkPostFactory) => new LinkPostMemoryRepository(linkPostFactory),
      inject: [LinkPostFactory]
    },
    LinkPostFactory,
    {
      provide: 'PhotoPostRepository',
      useFactory: (photoPostFactory: PhotoPostFactory) => new PhotoPostMemoryRepository(photoPostFactory),
      inject: [PhotoPostFactory]
    },
    PhotoPostFactory,
    {
      provide: 'QuotePostRepository',
      useFactory: (quotePostFactory: QuotePostFactory) => new QuotePostMemoryRepository(quotePostFactory),
      inject: [QuotePostFactory]
    },
    QuotePostFactory,
    {
      provide: 'TextPostRepository',
      useFactory: (textPostFactory: TextPostFactory) => new TextPostMemoryRepository(textPostFactory),
      inject: [TextPostFactory]
    },
    TextPostFactory,
    {
      provide: 'VideoPostRepository',
      useFactory: (videoPostFactory: VideoPostFactory) => new VideoPostMemoryRepository(videoPostFactory),
      inject: [VideoPostFactory]
    },
    VideoPostFactory
  ],
  exports: [
    'CommentRepository',
    'LinkPostRepository',
    'PhotoPostRepository',
    'QuotePostRepository',
    'TextPostRepository',
    'VideoPostRepository'
  ]
})
export class ContentCoreModule {
}

import { Module } from '@nestjs/common';
import { PrismaClientModule, PrismaClientService } from '@project/prisma-client';
import { CommentFactory } from './entity/comment/comment.factory';
import { LinkPostFactory } from './entity/link/link-post.factory';
import { PhotoPostFactory } from './entity/photo/photo-post.factory';
import { PostFactory } from './entity/post/post.factory';
import { QuotePostFactory } from './entity/quote/quote-post.factory';
import { TextPostFactory } from './entity/text/text-post.factory';
import { VideoPostFactory } from './entity/video/video-post.factory';
import { CommentPostgresRepository } from './repository/comment/comment-postgres.repository';
import { LinkPostPostgresRepository } from './repository/link/link-post-postgres.repository';
import { PhotoPostPostgresRepository } from './repository/photo/photo-post-postgres.repository';
import { PostPostgresRepository } from './repository/post/post-postgres.repository';
import { QuotePostPostgresRepository } from './repository/quote/quote-post-postgres.repository';
import { TextPostPostgresRepository } from './repository/text/text-post-postgres.repository';
import { VideoPostPostgresRepository } from './repository/video/video-post-postgres.repository';

@Module({
  imports: [PrismaClientModule],
  providers: [
    {
      provide: 'CommentRepository',
      useFactory: (commentFactory: CommentFactory, prismaClientService: PrismaClientService) =>
        new CommentPostgresRepository(commentFactory, prismaClientService),
      inject: [CommentFactory, PrismaClientService]
    },
    CommentFactory,
    {
      provide: 'PostRepository',
      useFactory: (postFactory: PostFactory, prismaClientService: PrismaClientService) =>
        new PostPostgresRepository(postFactory, prismaClientService),
      inject: [PostFactory, PrismaClientService]
    },
    PostFactory,
    {
      provide: 'LinkPostRepository',
      useFactory: (linkPostFactory: LinkPostFactory, prismaClientService: PrismaClientService) =>
        new LinkPostPostgresRepository(linkPostFactory, prismaClientService),
      inject: [LinkPostFactory, PrismaClientService]
    },
    LinkPostFactory,
    {
      provide: 'PhotoPostRepository',
      useFactory: (photoPostFactory: PhotoPostFactory, prismaClientService: PrismaClientService) =>
        new PhotoPostPostgresRepository(photoPostFactory, prismaClientService),
      inject: [PhotoPostFactory, PrismaClientService]
    },
    PhotoPostFactory,
    {
      provide: 'QuotePostRepository',
      useFactory: (quotePostFactory: QuotePostFactory, prismaClientService: PrismaClientService) =>
        new QuotePostPostgresRepository(quotePostFactory, prismaClientService),
      inject: [QuotePostFactory, PrismaClientService]
    },
    QuotePostFactory,
    {
      provide: 'TextPostRepository',
      useFactory: (textPostFactory: TextPostFactory, prismaClientService: PrismaClientService) =>
        new TextPostPostgresRepository(textPostFactory, prismaClientService),
      inject: [TextPostFactory, PrismaClientService]
    },
    TextPostFactory,
    {
      provide: 'VideoPostRepository',
      useFactory: (videoPostFactory: VideoPostFactory, prismaClientService: PrismaClientService) =>
        new VideoPostPostgresRepository(videoPostFactory, prismaClientService),
      inject: [VideoPostFactory, PrismaClientService]
    },
    VideoPostFactory
  ],
  exports: [
    'CommentRepository',
    'PostRepository',
    'LinkPostRepository',
    'PhotoPostRepository',
    'QuotePostRepository',
    'TextPostRepository',
    'VideoPostRepository',
  ]
})
export class ContentCoreModule {
}

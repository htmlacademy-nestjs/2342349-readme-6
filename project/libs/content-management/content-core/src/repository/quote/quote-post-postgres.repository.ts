import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, PostStatus, PostType } from '@project/shared-core';
import { QuotePostEntity } from '../../entity/quote/quote-post.entity';
import { PostPostgresRepository } from '../post/post-postgres.repository';
import { QuotePostRepository } from './quote-post.repository.inteface';

type PostWithDetails = Prisma.PostGetPayload<{
  include: { quoteDetails: true };
}>;

@Injectable()
export class QuotePostPostgresRepository extends PostPostgresRepository<QuotePostEntity> implements QuotePostRepository {
  constructor(
    entityFactory: EntityFactory<QuotePostEntity>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private formatPostForPrisma(quotePostEntity: QuotePostEntity) {
    return {
      ...quotePostEntity,
      _id: undefined,
      id: undefined,
      text: undefined,
      quoteAuthorId: undefined,
    };
  }

  private reformatQuotePostFromPrisma(createdQuotePost: PostWithDetails | null): QuotePostEntity {
    if (!createdQuotePost) {
      return null;
    }

    const quotePostEntityData = {
      ...createdQuotePost,
      postStatus: createdQuotePost.postStatus as PostStatus,
      postType: createdQuotePost.postType as PostType,
      text: createdQuotePost.quoteDetails?.text,
      quoteAuthorId: createdQuotePost.quoteDetails?.quoteAuthorId
    };

    return this.createEntityFromDocument(quotePostEntityData);
  }

  public async save(quotePostEntity: QuotePostEntity): Promise<QuotePostEntity> {
    const quotePostData = this.formatPostForPrisma(quotePostEntity);

    const createdQuotePost = await this.client.post.create({
      data: {
        ...quotePostData,
        quoteDetails: {
          create: {
            text: quotePostEntity.text,
            quoteAuthorId: quotePostEntity.quoteAuthorId
          }
        }
      },
      include: { quoteDetails: true }
    });

    return this.reformatQuotePostFromPrisma(createdQuotePost);
  }

  public async update(postId: QuotePostEntity['id'], quotePostEntity: QuotePostEntity): Promise<QuotePostEntity> {
    const quotePostData = this.formatPostForPrisma(quotePostEntity);

    const updatedQuotePost = await this.client.post.update({
      where: { id: postId },
      data: {
        ...quotePostData,
        quoteDetails: {
          update: {
            text: quotePostEntity.text,
            quoteAuthorId: quotePostEntity.quoteAuthorId
          }
        }
      },
      include: { quoteDetails: true }
    });

    return this.reformatQuotePostFromPrisma(updatedQuotePost);
  }

  public async findById(postId: QuotePostEntity['id']): Promise<QuotePostEntity | null> {
    const quotePostData = await this.client.post.findUnique({
      where: { id: postId },
      include: { quoteDetails: true }
    });

    return this.reformatQuotePostFromPrisma(quotePostData);
  }

  public async deleteById(id: QuotePostEntity['id']): Promise<QuotePostEntity> {
    const deletedPost = await this.client.post.delete({
      where: { id },
      include: { quoteDetails: true }
    });

    return this.reformatQuotePostFromPrisma(deletedPost);
  }

  public async exists(quotePostId: QuotePostEntity['id']): Promise<boolean> {
    const quotePost = await this.client.quotePost.findUnique({
      where: { id: quotePostId },
      select: { id: true }
    });

    return quotePost !== null;
  }
}
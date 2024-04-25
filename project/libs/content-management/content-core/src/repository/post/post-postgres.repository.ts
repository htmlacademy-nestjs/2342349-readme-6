import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BasePostgresRepository } from '@project/data-access';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, SortType, StorableEntity } from '@project/shared-core';
import { PostSearchQuery } from '@project/search';
import { PostEntity } from '../../entity/post/post.entity';
import { PostRepository } from './post.repository.inteface';

@Injectable()
export class PostPostgresRepository<T extends PostEntity & StorableEntity<ReturnType<T['toPOJO']>>> extends BasePostgresRepository<T> implements PostRepository {
  constructor(
    entityFactory: EntityFactory<T>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async save(entity: PostEntity): Promise<PostEntity> {
    throw new Error('Not implemented');
  }

  public async findById(postId: PostEntity['id']): Promise<PostEntity | null> {
    const post = await this.client.post.findFirst({
      where: { id: postId }
    });

    return this.createEntityFromDocument(post);
  }

  public async deleteById(postId: PostEntity['id']): Promise<PostEntity> {
    const deletedComment = await this.client.post.delete({
      where: { id: postId }
    });

    return this.createEntityFromDocument(deletedComment);
  }

  public async update(id: PostEntity['id'], entity: PostEntity): Promise<PostEntity> {
    throw new Error('Not implemented');
  }

  public async exists(postId: PostEntity['id']): Promise<boolean> {
    const post = await this.client.post.findUnique({
      where: { id: postId },
      select: { id: true }
    });

    return post !== null;
  }

  public async existsRepostByUser(originalPostId: PostEntity['id'], authorId: PostEntity['id']): Promise<boolean> {
    const post = await this.client.post.findFirst({
      where: {
        originalPostId: originalPostId,
        authorId: authorId
      },
      select: { id: true }
    });

    return post !== null;
  }

  public async incrementRepostCount(postId: string): Promise<boolean> {
    const incrementedPost = await this.client.post.update({
      where: { id: postId },
      data: {
        repostCount: { increment: 1 }
      }
    });

    return incrementedPost !== null;
  }

  public async incrementCommentCount(postId: string): Promise<boolean> {
    const incrementedPost = await this.client.post.update({
      where: { id: postId },
      data: {
        commentCount: { increment: 1 }
      }
    });

    return incrementedPost !== null;
  }

  public async decrementCommentCount(postId: string): Promise<boolean> {
    const incrementedPost = await this.client.post.update({
      where: { id: postId },
      data: {
        commentCount: { decrement: 1 }
      }
    });

    return incrementedPost !== null;
  }

  public async likePost(postId: string, updatedUserLikeIds: string[]): Promise<PostEntity> {
    const likedPost = await this.client.post.update({
      where: { id: postId },
      data: {
        likeCount: { increment: 1 },
        userLikeIds: { set: updatedUserLikeIds }
      }
    });

    return this.createEntityFromDocument(likedPost);
  }

  public async unlikePost(postId: string, updatedUserLikeIds: string[]): Promise<PostEntity> {
    const unlikedPost = await this.client.post.update({
      where: { id: postId },
      data: {
        likeCount: { decrement: 1 },
        userLikeIds: { set: updatedUserLikeIds }
      }
    });

    return this.createEntityFromDocument(unlikedPost);
  }

  public async searchPosts(
    { page, limit, title, authorId, postType, tags, sortDirection, sortType, postStatus }: PostSearchQuery
  ) {

    const where: Prisma.PostWhereInput = {};
    if (authorId) {
      where.authorId = authorId;
    }
    if (postStatus) {
      where.postStatus = postStatus;
    }
    if (postType) {
      where.postType = postType;
    }
    if (tags.length) {
      where.tags = { hasSome: tags };
    }
    if (title) {
      where.OR = [
        {
          videoDetails: {
            title: {
              contains: title,
              mode: 'insensitive'
            }
          }
        },
        {
          textDetails: {
            title: {
              contains: title,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    const orderBy: Prisma.PostOrderByWithRelationInput = {};
    switch (sortType) {
      case SortType.BY_DATE:
        orderBy.createdAt = sortDirection;
        break;
      case SortType.BY_COMMENT:
        orderBy.commentCount = sortDirection;
        break;
      case SortType.BY_LIKE:
        orderBy.likeCount = sortDirection;
        break;
    }

    const [posts, postsCount] = await Promise.all([
      this.client.post.findMany({
        where: where,
        orderBy: orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          linkDetails: true,
          quoteDetails: true,
          photoDetails: true,
          textDetails: true,
          videoDetails: true
        }
      }),
      this.client.post.count({ where: where })
    ]);

    console.log(where);
    console.log(orderBy);
    console.log(posts);

    return {
      entities: posts.map(post => this.createEntityFromDocument(post)),
      totalPages: Math.ceil(postsCount / limit),
      currentPage: page,
      totalItems: postsCount,
      itemsPerPage: limit
    };
  }
}

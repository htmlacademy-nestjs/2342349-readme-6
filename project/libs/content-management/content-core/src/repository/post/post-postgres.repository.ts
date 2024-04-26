import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, StorableEntity } from '@project/shared-core';
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
}

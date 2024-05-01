import { Injectable } from '@nestjs/common';
import { CommentQuery } from '@project/comment';
import { BasePostgresRepository } from '@project/data-access';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, PaginationResult } from '@project/shared-core';
import { CommentEntity } from '../../entity/comment/comment.entity';
import { CommentRepository } from './comment.repository.interface';

@Injectable()
export class CommentPostgresRepository extends BasePostgresRepository<CommentEntity> implements CommentRepository {
  constructor(
    entityFactory: EntityFactory<CommentEntity>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async save(entity: CommentEntity): Promise<CommentEntity> {
    const createdComment = await this.client.comment.create({
      data: {
        ...entity.toPOJO(),
        id: undefined
      }
    });

    return this.createEntityFromDocument(createdComment);
  }

  public async findById(commentId: CommentEntity['id']): Promise<CommentEntity | null> {
    const comment = await this.client.comment.findFirst({
      where: { id: commentId }
    });

    return this.createEntityFromDocument(comment);
  }

  public async findAllByPostId(
    postId: string,
    { limit, sortDirection, page }: CommentQuery
  ): Promise<PaginationResult<CommentEntity>> {

    const [comments, commentCount] = await Promise.all([
      this.client.comment.findMany({
        where: { postId: postId },
        orderBy: { createdAt: sortDirection },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.client.comment.count({ where: { postId: postId } })
    ]);

    return {
      entities: comments.map(comment => this.createEntityFromDocument(comment)),
      totalPages: Math.ceil(commentCount / limit),
      currentPage: page,
      totalItems: commentCount,
      itemsPerPage: limit
    };
  }

  public async deleteById(commentId: CommentEntity['id']): Promise<CommentEntity> {
    const deletedComment = await this.client.comment.delete({
      where: { id: commentId }
    });

    return this.createEntityFromDocument(deletedComment);
  }

  public async update(commentId: CommentEntity['id'], entity: CommentEntity): Promise<CommentEntity> {
    const updatedComment = await this.client.comment.update({
      where: { id: commentId },
      data: {
        ...entity.toPOJO(),
        id: undefined
      }
    });

    return this.createEntityFromDocument(updatedComment);
  }

  public async exists(commentId: CommentEntity['id']): Promise<boolean> {
    const comment = await this.client.comment.findUnique({
      where: { id: commentId },
      select: { id: true }
    });

    return comment !== null;
  }
}

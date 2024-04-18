import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { EntityFactory } from '@project/shared-core';
import { PrismaClientService } from '@project/prisma-client';
import { CommentEntity } from '../../entity/comment/comment.entity';
import { CommentRepository } from './comment.repository.inteface';

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
        id: undefined,
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

  public async findAllByPostId(postId: string): Promise<CommentEntity[]> {
    const comments = await this.client.comment.findMany({
      where: { postId: postId }
    });

    return comments.map(comment => this.createEntityFromDocument(comment));
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
        id: undefined,
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

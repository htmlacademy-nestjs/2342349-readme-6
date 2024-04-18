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

  public async findById(postId: PostEntity["id"]): Promise<PostEntity | null> {
    const post = await this.client.post.findFirst({
      where: { id: postId }
    });

    return this.createEntityFromDocument(post);
  }

  public async deleteById(postId: PostEntity["id"]): Promise<PostEntity> {
    const deletedComment = await this.client.post.delete({
      where: { id: postId }
    });

    return this.createEntityFromDocument(deletedComment);
  }

  public async update(id: PostEntity["id"], entity: PostEntity): Promise<PostEntity> {
    throw new Error('Not implemented');
  }

  public async exists(postId: PostEntity["id"]): Promise<boolean> {
    const post = await this.client.post.findUnique({
      where: { id: postId },
      select: { id: true }
    });

    return post !== null;
  }

  public async existsRepostByUser(originalPostId: PostEntity["id"], authorId: PostEntity["id"]): Promise<boolean> {
    const post = await this.client.post.findFirst({
      where: {
        originalPostId: originalPostId,
        authorId: authorId
      },
      select: { id: true }
    });

    return post !== null;
  }
}

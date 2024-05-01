import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, PostStatus, PostType } from '@project/shared-core';
import { TextPostEntity } from '../../entity/text/text-post.entity';
import { PostPostgresRepository } from '../post/post-postgres.repository';
import { TextPostRepository } from './text-post.repository.interface';

export type TextPostWithDetails = Prisma.PostGetPayload<{
  include: { textDetails: true };
}>;

@Injectable()
export class TextPostPostgresRepository extends PostPostgresRepository<TextPostEntity> implements TextPostRepository {
  constructor(
    entityFactory: EntityFactory<TextPostEntity>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private formatPostForPrisma(textPostEntity: TextPostEntity) {
    return {
      ...textPostEntity,
      _id: undefined,
      id: undefined,
      title: undefined,
      announcement: undefined,
      text: undefined,
    };
  }

  public convertToTextPostEntity(createdTextPost: TextPostWithDetails | null): TextPostEntity {
    if (!createdTextPost) {
      return null;
    }

    const textPostEntityData = {
      ...createdTextPost,
      postStatus: createdTextPost.postStatus as PostStatus,
      postType: createdTextPost.postType as PostType,
      title: createdTextPost.textDetails?.title,
      announcement: createdTextPost.textDetails?.announcement,
      text: createdTextPost.textDetails?.text
    };

    return this.createEntityFromDocument(textPostEntityData);
  }

  public async save(textPostEntity: TextPostEntity): Promise<TextPostEntity> {
    const textPostData = this.formatPostForPrisma(textPostEntity);

    const createdTextPost = await this.client.post.create({
      data: {
        ...textPostData,
        textDetails: {
          create: {
            title: textPostEntity.title,
            announcement: textPostEntity.announcement,
            text: textPostEntity.text,
          }
        }
      },
      include: { textDetails: true }
    });

    return this.convertToTextPostEntity(createdTextPost);
  }

  public async update(postId: TextPostEntity['id'], textPostEntity: TextPostEntity): Promise<TextPostEntity> {
    const textPostData = this.formatPostForPrisma(textPostEntity);

    const updatedTextPost = await this.client.post.update({
      where: { id: postId },
      data: {
        ...textPostData,
        textDetails: {
          update: {
            title: textPostEntity.title,
            announcement: textPostEntity.announcement,
            text: textPostEntity.text,
          }
        }
      },
      include: { textDetails: true }
    });

    return this.convertToTextPostEntity(updatedTextPost);
  }

  public async findById(postId: TextPostEntity['id']): Promise<TextPostEntity | null> {
    const textPostData = await this.client.post.findUnique({
      where: { id: postId },
      include: { textDetails: true }
    });

    return this.convertToTextPostEntity(textPostData);
  }

  public async deleteById(id: TextPostEntity['id']): Promise<TextPostEntity> {
    const deletedPost = await this.client.post.delete({
      where: { id },
      include: { textDetails: true }
    });

    return this.convertToTextPostEntity(deletedPost);
  }

  public async exists(textPostId: TextPostEntity['id']): Promise<boolean> {
    const textPost = await this.client.textPost.findUnique({
      where: { id: textPostId },
      select: { id: true }
    });

    return textPost !== null;
  }
}

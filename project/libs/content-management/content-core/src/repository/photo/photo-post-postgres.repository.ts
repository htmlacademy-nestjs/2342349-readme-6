import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, PostStatus, PostType } from '@project/shared-core';
import { PhotoPostEntity } from '../../entity/photo/photo-post.entity';
import { PostPostgresRepository } from '../post/post-postgres.repository';
import { PhotoPostRepository } from './photo-post.repository.inteface';

export type PhotoPostWithDetails = Prisma.PostGetPayload<{
  include: { photoDetails: true };
}>;

@Injectable()
export class PhotoPostPostgresRepository extends PostPostgresRepository<PhotoPostEntity> implements PhotoPostRepository {
  constructor(
    entityFactory: EntityFactory<PhotoPostEntity>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private formatPostForPrisma(photoPostEntity: PhotoPostEntity) {
    return {
      ...photoPostEntity,
      _id: undefined,
      id: undefined,
      url: undefined,
    };
  }

  public convertToPhotoPostEntity(createdPhotoPost: PhotoPostWithDetails | null): PhotoPostEntity {
    if (!createdPhotoPost) {
      return null;
    }

    const photoPostEntityData = {
      ...createdPhotoPost,
      postStatus: createdPhotoPost.postStatus as PostStatus,
      postType: createdPhotoPost.postType as PostType,
      url: createdPhotoPost.photoDetails?.url,
    };

    return this.createEntityFromDocument(photoPostEntityData);
  }

  public async save(photoPostEntity: PhotoPostEntity): Promise<PhotoPostEntity> {
    const photoPostData = this.formatPostForPrisma(photoPostEntity);

    const createdPhotoPost = await this.client.post.create({
      data: {
        ...photoPostData,
        photoDetails: {
          create: {
            url: photoPostEntity.url,
          }
        }
      },
      include: { photoDetails: true }
    });

    return this.convertToPhotoPostEntity(createdPhotoPost);
  }

  public async update(postId: PhotoPostEntity['id'], photoPostEntity: PhotoPostEntity): Promise<PhotoPostEntity> {
    const photoPostData = this.formatPostForPrisma(photoPostEntity);

    const updatedPhotoPost = await this.client.post.update({
      where: { id: postId },
      data: {
        ...photoPostData,
        photoDetails: {
          update: {
            url: photoPostEntity.url,
          }
        }
      },
      include: { photoDetails: true }
    });

    return this.convertToPhotoPostEntity(updatedPhotoPost);
  }

  public async findById(postId: PhotoPostEntity['id']): Promise<PhotoPostEntity | null> {
    const photoPostData = await this.client.post.findUnique({
      where: { id: postId },
      include: { photoDetails: true }
    });

    return this.convertToPhotoPostEntity(photoPostData);
  }

  public async deleteById(id: PhotoPostEntity['id']): Promise<PhotoPostEntity> {
    const deletedPost = await this.client.post.delete({
      where: { id },
      include: { photoDetails: true }
    });

    return this.convertToPhotoPostEntity(deletedPost);
  }

  public async exists(photoPostId: PhotoPostEntity['id']): Promise<boolean> {
    const photoPost = await this.client.photoPost.findUnique({
      where: { id: photoPostId },
      select: { id: true }
    });

    return photoPost !== null;
  }
}

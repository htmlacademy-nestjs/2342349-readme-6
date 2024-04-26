import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, PostStatus, PostType } from '@project/shared-core';
import { VideoPostEntity } from '../../entity/video/video-post.entity';
import { PostPostgresRepository } from '../post/post-postgres.repository';
import { VideoPostRepository } from './video-post.repository.inteface';

export type VideoPostWithDetails = Prisma.PostGetPayload<{
  include: { videoDetails: true };
}>;

@Injectable()
export class VideoPostPostgresRepository extends PostPostgresRepository<VideoPostEntity> implements VideoPostRepository {
  constructor(
    entityFactory: EntityFactory<VideoPostEntity>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private formatPostForPrisma(videoPostEntity: VideoPostEntity) {
    return {
      ...videoPostEntity,
      _id: undefined,
      id: undefined,
      title: undefined,
      url: undefined,
    };
  }

  public convertToVideoPostEntity(createdVideoPost: VideoPostWithDetails | null): VideoPostEntity {
    if (!createdVideoPost) {
      return null;
    }

    const videoPostEntityData = {
      ...createdVideoPost,
      postStatus: createdVideoPost.postStatus as PostStatus,
      postType: createdVideoPost.postType as PostType,
      title: createdVideoPost.videoDetails?.title,
      url: createdVideoPost.videoDetails?.url
    };

    return this.createEntityFromDocument(videoPostEntityData);
  }

  public async save(videoPostEntity: VideoPostEntity): Promise<VideoPostEntity> {
    const videoPostData = this.formatPostForPrisma(videoPostEntity);

    const createdVideoPost = await this.client.post.create({
      data: {
        ...videoPostData,
        videoDetails: {
          create: {
            title: videoPostEntity.title,
            url: videoPostEntity.url
          }
        }
      },
      include: { videoDetails: true }
    });

    return this.convertToVideoPostEntity(createdVideoPost);
  }

  public async update(postId: VideoPostEntity['id'], videoPostEntity: VideoPostEntity): Promise<VideoPostEntity> {
    const videoPostData = this.formatPostForPrisma(videoPostEntity);

    const updatedVideoPost = await this.client.post.update({
      where: { id: postId },
      data: {
        ...videoPostData,
        videoDetails: {
          update: {
            title: videoPostEntity.title,
            url: videoPostEntity.url
          }
        }
      },
      include: { videoDetails: true }
    });

    return this.convertToVideoPostEntity(updatedVideoPost);
  }

  public async findById(postId: VideoPostEntity['id']): Promise<VideoPostEntity | null> {
    const videoPostData = await this.client.post.findUnique({
      where: { id: postId },
      include: { videoDetails: true }
    });

    return this.convertToVideoPostEntity(videoPostData);
  }

  public async deleteById(id: VideoPostEntity['id']): Promise<VideoPostEntity> {
    const deletedPost = await this.client.post.delete({
      where: { id },
      include: { videoDetails: true }
    });

    return this.convertToVideoPostEntity(deletedPost);
  }

  public async exists(videoPostId: VideoPostEntity['id']): Promise<boolean> {
    const videoPost = await this.client.videoPost.findUnique({
      where: { id: videoPostId },
      select: { id: true }
    });

    return videoPost !== null;
  }
}

import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { VideoPostEntity, VideoPostRepository } from '@project/content-core';
import { PostType } from '@project/shared-core';
import { CreateVideoPostDto } from './dto/create-video-post.dto';
import { UpdateVideoPostDto } from './dto/update-video-post.dto';
import {
  VIDEO_POST_DELETE_PERMISSION,
  VIDEO_POST_MODIFY_PERMISSION,
  VIDEO_POST_NOT_FOUND,
  VIDEO_POST_REPOST_AUTHOR,
  VIDEO_POST_REPOST_EXISTS
} from './video-post.constant';

@Injectable()
export class VideoPostService {
  constructor(
    @Inject('VideoPostRepository') private readonly videoPostRepository: VideoPostRepository,
  ) {}

  public async createPost(userId: string, dto: CreateVideoPostDto, originalPostId?: string): Promise<VideoPostEntity> {
    const videoPostData = {
      authorId: userId,
      postType: PostType.VIDEO,
      title: dto.title,
      url: dto.url,
      tags: dto.tags ?? [],
      originalPost: originalPostId ?? '',
    };

    const videoPostEntity = new VideoPostEntity(videoPostData);
    await this.videoPostRepository.save(videoPostEntity);

    return videoPostEntity;
  }

  public async findPostById(postId: string): Promise<VideoPostEntity> {
    const foundVidePost = await this.videoPostRepository.findById(postId);
    if (!foundVidePost) {
      throw new NotFoundException(VIDEO_POST_NOT_FOUND);
    }

    return foundVidePost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.videoPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateVideoPostDto): Promise<VideoPostEntity> {
    const updatedVideoPost = await this.findPostById(postId);
    if (updatedVideoPost.authorId !== userId) {
      throw new UnauthorizedException(VIDEO_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedVideoPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedVideoPost.postStatus = dto.postStatus;
    if (dto.title !== undefined) updatedVideoPost.title = dto.title;
    if (dto.url !== undefined) updatedVideoPost.url = dto.url;

    return await this.videoPostRepository.update(postId, updatedVideoPost);
  }

  public async deletePostById(userId: string, postId: string): Promise<VideoPostEntity> {
    const deletedVideoPost = await this.findPostById(postId);
    if (deletedVideoPost.authorId !== userId) {
      throw new UnauthorizedException(VIDEO_POST_DELETE_PERMISSION);
    }

    await this.videoPostRepository.deleteById(postId);

    return deletedVideoPost;
  }

  public async repostPostById(userId: string, postId: string): Promise<VideoPostEntity> {
    const repostTextPost = await this.findPostById(postId);
    if (repostTextPost.authorId === userId) {
      throw new UnauthorizedException(VIDEO_POST_REPOST_AUTHOR);
    }

    //todo проверка что был уже репост
    if (false) {
      throw new ConflictException(VIDEO_POST_REPOST_EXISTS);
    }

    const createVideoPostDto: CreateVideoPostDto = {
      tags: repostTextPost.tags,
      title: repostTextPost.title,
      url: repostTextPost.url,
    }

    return await this.createPost(userId, createVideoPostDto, repostTextPost.id);
  }
}

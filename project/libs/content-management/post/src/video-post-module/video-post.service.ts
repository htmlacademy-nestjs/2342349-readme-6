import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { VideoPostEntity, VideoPostRepository } from '@project/content-core';
import { PostService } from '@project/post';
import { PostType } from '@project/shared-core';
import { CreateVideoPostDto } from './dto/create-video-post.dto';
import { UpdateVideoPostDto } from './dto/update-video-post.dto';
import {
  VIDEO_POST_DELETE_PERMISSION,
  VIDEO_POST_DIFFERENT_TYPE,
  VIDEO_POST_MODIFY_PERMISSION,
  VIDEO_POST_NOT_FOUND,
  VIDEO_POST_REPOST_AUTHOR,
  VIDEO_POST_REPOST_EXISTS
} from './video-post.constant';

@Injectable()
export class VideoPostService {
  constructor(
    @Inject('VideoPostRepository') private readonly videoPostRepository: VideoPostRepository,
    private readonly postService: PostService
  ) {
  }

  public async createPost(userId: string, dto: CreateVideoPostDto, originalPostId?: string): Promise<VideoPostEntity> {
    const videoPostData = {
      authorId: userId,
      postType: PostType.VIDEO,
      tags: dto.tags ? [...new Set(dto.tags.map(tag => tag.toLowerCase()))] : [],
      originalPostId: originalPostId ?? '',
      title: dto.title,
      url: dto.url
    };

    const videoPostEntity = new VideoPostEntity(videoPostData);

    return this.videoPostRepository.save(videoPostEntity);
  }

  public async findPostById(postId: string): Promise<VideoPostEntity> {
    const foundVidePost = await this.videoPostRepository.findById(postId);
    if (!foundVidePost) {
      throw new NotFoundException(VIDEO_POST_NOT_FOUND);
    }
    if (foundVidePost.postType !== PostType.VIDEO) {
      throw new BadRequestException(VIDEO_POST_DIFFERENT_TYPE);
    }

    return foundVidePost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.videoPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateVideoPostDto): Promise<VideoPostEntity> {
    const updatedVideoPost = await this.findPostById(postId);
    if (updatedVideoPost.postType !== PostType.VIDEO) {
      throw new BadRequestException(VIDEO_POST_DIFFERENT_TYPE);
    }
    if (updatedVideoPost.authorId !== userId) {
      throw new UnauthorizedException(VIDEO_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedVideoPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedVideoPost.postStatus = dto.postStatus;
    if (dto.postedAt !== undefined) updatedVideoPost.postedAt = dto.postedAt;
    if (dto.title !== undefined) updatedVideoPost.title = dto.title;
    if (dto.url !== undefined) updatedVideoPost.url = dto.url;

    return this.videoPostRepository.update(postId, updatedVideoPost);
  }

  public async deletePostById(userId: string, postId: string): Promise<VideoPostEntity> {
    const deletedVideoPost = await this.findPostById(postId);
    if (deletedVideoPost.authorId !== userId) {
      throw new UnauthorizedException(VIDEO_POST_DELETE_PERMISSION);
    }

    return this.videoPostRepository.deleteById(postId);
  }

  public async repostPostById(userId: string, postId: string): Promise<VideoPostEntity> {
    const repostVideoPost = await this.findPostById(postId);
    if (repostVideoPost.postType !== PostType.VIDEO) {
      throw new BadRequestException(VIDEO_POST_DIFFERENT_TYPE);
    }
    if (repostVideoPost.authorId === userId) {
      throw new UnauthorizedException(VIDEO_POST_REPOST_AUTHOR);
    }

    if (await this.postService.existsRepostByUser(postId, userId)) {
      throw new ConflictException(VIDEO_POST_REPOST_EXISTS);
    }

    const createVideoPostDto: CreateVideoPostDto = {
      tags: repostVideoPost.tags,
      title: repostVideoPost.title,
      url: repostVideoPost.url
    };

    const repostedVideoPost = await this.createPost(userId, createVideoPostDto, repostVideoPost.id);
    await this.postService.incrementRepostCount(postId);

    return repostedVideoPost;
  }
}

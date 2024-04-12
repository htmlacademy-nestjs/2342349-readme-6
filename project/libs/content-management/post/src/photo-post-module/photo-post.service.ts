import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PhotoPostEntity, PhotoPostRepository } from '@project/content-core';
import { PostType } from '@project/shared-core';
import { CreatePhotoPostDto } from './dto/create-photo-post.dto';
import { UpdatePhotoPostDto } from './dto/update-photo-post.dto';
import {
  PHOTO_POST_DELETE_PERMISSION,
  PHOTO_POST_MODIFY_PERMISSION,
  PHOTO_POST_NOT_FOUND,
  PHOTO_POST_REPOST_AUTHOR,
  PHOTO_POST_REPOST_EXISTS
} from './photo-post.constant';


@Injectable()
export class PhotoPostService {
  constructor(
    @Inject('PhotoPostRepository') private readonly photoPostRepository: PhotoPostRepository,
  ) {}

  public async createPost(userId: string, dto: CreatePhotoPostDto, originalPostId?: string): Promise<PhotoPostEntity> {
    const photoPostData = {
      authorId: userId,
      postType: PostType.LINK,
      url: dto.url,
      tags: dto.tags ?? [],
      originalPost: originalPostId ?? '',
    };

    const photoPostEntity = new PhotoPostEntity(photoPostData);
    await this.photoPostRepository.save(photoPostEntity);

    return photoPostEntity;
  }

  public async findPostById(postId: string): Promise<PhotoPostEntity> {
    const foundPhotoPost = await this.photoPostRepository.findById(postId);
    if (!foundPhotoPost) {
      throw new NotFoundException(PHOTO_POST_NOT_FOUND);
    }

    return foundPhotoPost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.photoPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdatePhotoPostDto): Promise<PhotoPostEntity> {
    const updatedPhotoPost = await this.findPostById(postId);
    if (updatedPhotoPost.authorId !== userId) {
      throw new UnauthorizedException(PHOTO_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedPhotoPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedPhotoPost.postStatus = dto.postStatus;
    if (dto.url !== undefined) updatedPhotoPost.url = dto.url;

    return await this.photoPostRepository.update(postId, updatedPhotoPost);
  }

  public async deletePostById(userId: string, postId: string): Promise<PhotoPostEntity> {
    const deletedPhotoPost = await this.findPostById(postId);
    if (deletedPhotoPost.authorId !== userId) {
      throw new UnauthorizedException(PHOTO_POST_DELETE_PERMISSION);
    }

    await this.photoPostRepository.deleteById(postId);

    return deletedPhotoPost;
  }

  public async repostPostById(userId: string, postId: string): Promise<PhotoPostEntity> {
    const repostPhotoPost = await this.findPostById(postId);
    if (repostPhotoPost.authorId === userId) {
      throw new UnauthorizedException(PHOTO_POST_REPOST_AUTHOR);
    }

    //todo проверка что был уже репост
    if (false) {
      throw new ConflictException(PHOTO_POST_REPOST_EXISTS);
    }

    const createPhotoPostDto: CreatePhotoPostDto = {
      tags: repostPhotoPost.tags,
      url: repostPhotoPost.url
    }

    return await this.createPost(userId, createPhotoPostDto, repostPhotoPost.id);
  }
}


import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { PhotoPostEntity, PhotoPostRepository } from '@project/content-core';
import { PostService } from '@project/post';
import { PostType } from '@project/shared-core';
import { CreatePhotoPostDto } from './dto/create-photo-post.dto';
import { UpdatePhotoPostDto } from './dto/update-photo-post.dto';
import {
  PHOTO_POST_DELETE_PERMISSION,
  PHOTO_POST_DIFFERENT_TYPE,
  PHOTO_POST_MODIFY_PERMISSION,
  PHOTO_POST_NOT_FOUND,
  PHOTO_POST_REPOST_AUTHOR,
  PHOTO_POST_REPOST_EXISTS
} from './photo-post.constant';


@Injectable()
export class PhotoPostService {
  constructor(
    @Inject('PhotoPostRepository') private readonly photoPostRepository: PhotoPostRepository,
    private readonly postService: PostService,
  ) {}

  public async createPost(userId: string, dto: CreatePhotoPostDto, originalPostId?: string): Promise<PhotoPostEntity> {
    const photoPostData = {
      authorId: userId,
      postType: PostType.LINK,
      tags: dto.tags ?? [],
      originalPostId: originalPostId ?? '',
      url: dto.url,
    };

    const photoPostEntity = new PhotoPostEntity(photoPostData);

    return this.photoPostRepository.save(photoPostEntity);
  }

  public async findPostById(postId: string): Promise<PhotoPostEntity> {
    const foundPhotoPost = await this.photoPostRepository.findById(postId);
    if (!foundPhotoPost) {
      throw new NotFoundException(PHOTO_POST_NOT_FOUND);
    }
    if (foundPhotoPost.postType !== PostType.PHOTO) {
      throw new BadRequestException(PHOTO_POST_DIFFERENT_TYPE);
    }

    return foundPhotoPost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.photoPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdatePhotoPostDto): Promise<PhotoPostEntity> {
    const updatedPhotoPost = await this.findPostById(postId);
    if (updatedPhotoPost.postType !== PostType.PHOTO) {
      throw new BadRequestException(PHOTO_POST_DIFFERENT_TYPE);
    }
    if (updatedPhotoPost.authorId !== userId) {
      throw new UnauthorizedException(PHOTO_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedPhotoPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedPhotoPost.postStatus = dto.postStatus;
    if (dto.url !== undefined) updatedPhotoPost.url = dto.url;

    return this.photoPostRepository.update(postId, updatedPhotoPost);
  }

  public async deletePostById(userId: string, postId: string): Promise<PhotoPostEntity> {
    const deletedPhotoPost = await this.findPostById(postId);
    if (deletedPhotoPost.authorId !== userId) {
      throw new UnauthorizedException(PHOTO_POST_DELETE_PERMISSION);
    }

    return this.photoPostRepository.deleteById(postId);
  }

  public async repostPostById(userId: string, postId: string): Promise<PhotoPostEntity> {
    const repostPhotoPost = await this.findPostById(postId);
    if (repostPhotoPost.postType !== PostType.PHOTO) {
      throw new BadRequestException(PHOTO_POST_DIFFERENT_TYPE);
    }
    if (repostPhotoPost.authorId === userId) {
      throw new UnauthorizedException(PHOTO_POST_REPOST_AUTHOR);
    }

    if (await this.postService.existsRepostByUser(postId, userId)) {
      throw new ConflictException(PHOTO_POST_REPOST_EXISTS);
    }

    const createPhotoPostDto: CreatePhotoPostDto = {
      tags: repostPhotoPost.tags,
      url: repostPhotoPost.url
    }

    const repostedPhotoPost = await this.createPost(userId, createPhotoPostDto, repostPhotoPost.id);
    await this.postService.incrementRepostCount(postId);

    return repostedPhotoPost;
  }
}


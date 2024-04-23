import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { TextPostEntity, TextPostRepository } from '@project/content-core';
import { PostService } from '@project/post';
import { PostType } from '@project/shared-core';
import { CreateTextPostDto } from './dto/create-text-post.dto';
import { UpdateTextPostDto } from './dto/update-text-post.dto';
import {
  TEXT_POST_DELETE_PERMISSION,
  TEXT_POST_DIFFERENT_TYPE,
  TEXT_POST_MODIFY_PERMISSION,
  TEXT_POST_NOT_FOUND,
  TEXT_POST_REPOST_AUTHOR,
  TEXT_POST_REPOST_EXISTS
} from './text-post.constant';


@Injectable()
export class TextPostService {
  constructor(
    @Inject('TextPostRepository') private readonly textPostRepository: TextPostRepository,
    private readonly postService: PostService,
  ) {}

  public async createPost(userId: string, dto: CreateTextPostDto, originalPostId?: string): Promise<TextPostEntity> {
    const textPostData = {
      authorId: userId,
      postType: PostType.LINK,
      tags: dto.tags ?? [],
      originalPostId: originalPostId ?? '',
      title: dto.title,
      announcement: dto.announcement,
      text: dto.text,
    };

    const textPostEntity = new TextPostEntity(textPostData);

    return this.textPostRepository.save(textPostEntity);
  }

  public async findPostById(postId: string): Promise<TextPostEntity> {
    const foundTextPost = await this.textPostRepository.findById(postId);
    if (!foundTextPost) {
      throw new NotFoundException(TEXT_POST_NOT_FOUND);
    }
    if (foundTextPost.postType !== PostType.TEXT) {
      throw new BadRequestException(TEXT_POST_DIFFERENT_TYPE);
    }

    return foundTextPost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.textPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateTextPostDto): Promise<TextPostEntity> {
    const updatedTextPost = await this.findPostById(postId);
    if (updatedTextPost.postType !== PostType.TEXT) {
      throw new BadRequestException(TEXT_POST_DIFFERENT_TYPE);
    }
    if (updatedTextPost.authorId !== userId) {
      throw new UnauthorizedException(TEXT_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedTextPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedTextPost.postStatus = dto.postStatus;
    if (dto.title !== undefined) updatedTextPost.title = dto.title;
    if (dto.announcement !== undefined) updatedTextPost.announcement = dto.announcement;
    if (dto.text !== undefined) updatedTextPost.text = dto.text;

    return this.textPostRepository.update(postId, updatedTextPost);
  }

  public async deletePostById(userId: string, postId: string): Promise<TextPostEntity> {
    const deletedTextPost = await this.findPostById(postId);
    if (deletedTextPost.authorId !== userId) {
      throw new UnauthorizedException(TEXT_POST_DELETE_PERMISSION);
    }

    return this.textPostRepository.deleteById(postId);
  }

  public async repostPostById(userId: string, postId: string): Promise<TextPostEntity> {
    const repostTextPost = await this.findPostById(postId);
    if (repostTextPost.postType !== PostType.TEXT) {
      throw new BadRequestException(TEXT_POST_DIFFERENT_TYPE);
    }
    if (repostTextPost.authorId === userId) {
      throw new UnauthorizedException(TEXT_POST_REPOST_AUTHOR);
    }

    if (await this.postService.existsRepostByUser(postId, userId)) {
      throw new ConflictException(TEXT_POST_REPOST_EXISTS);
    }

    const createTextPostDto: CreateTextPostDto = {
      tags: repostTextPost.tags,
      title: repostTextPost.title,
      announcement: repostTextPost.announcement,
      text: repostTextPost.text,
    }

    const repostedTextPost = await this.createPost(userId, createTextPostDto, repostTextPost.id);
    await this.postService.incrementRepostCount(postId);

    return repostedTextPost;
  }
}

import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TextPostEntity, TextPostRepository } from '@project/content-core';
import { PostType } from '@project/shared-core';
import { CreateTextPostDto } from './dto/create-text-post.dto';
import { UpdateTextPostDto } from './dto/update-text-post.dto';
import {
  TEXT_POST_DELETE_PERMISSION,
  TEXT_POST_MODIFY_PERMISSION,
  TEXT_POST_NOT_FOUND,
  TEXT_POST_REPOST_AUTHOR,
  TEXT_POST_REPOST_EXISTS
} from './text-post.constant';


@Injectable()
export class TextPostService {
  constructor(
    @Inject('TextPostRepository') private readonly textPostRepository: TextPostRepository,
  ) {}

  public async createPost(userId: string, dto: CreateTextPostDto, originalPostId?: string): Promise<TextPostEntity> {
    const textPostData = {
      authorId: userId,
      postType: PostType.LINK,
      title: dto.title,
      announcement: dto.announcement,
      text: dto.text,
      tags: dto.tags ?? [],
      originalPost: originalPostId ?? '',
    };

    const textPostEntity = new TextPostEntity(textPostData);
    await this.textPostRepository.save(textPostEntity);

    return textPostEntity;
  }

  public async findPostById(postId: string): Promise<TextPostEntity> {
    const foundTextPost = await this.textPostRepository.findById(postId);
    if (!foundTextPost) {
      throw new NotFoundException(TEXT_POST_NOT_FOUND);
    }

    return foundTextPost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.textPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateTextPostDto): Promise<TextPostEntity> {
    const updatedTextPost = await this.findPostById(postId);
    if (updatedTextPost.authorId !== userId) {
      throw new UnauthorizedException(TEXT_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedTextPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedTextPost.postStatus = dto.postStatus;
    if (dto.title !== undefined) updatedTextPost.title = dto.title;
    if (dto.announcement !== undefined) updatedTextPost.announcement = dto.announcement;
    if (dto.text !== undefined) updatedTextPost.text = dto.text;

    return await this.textPostRepository.update(postId, updatedTextPost);
  }

  public async deletePostById(userId: string, postId: string): Promise<TextPostEntity> {
    const deletedTextPost = await this.findPostById(postId);
    if (deletedTextPost.authorId !== userId) {
      throw new UnauthorizedException(TEXT_POST_DELETE_PERMISSION);
    }

    await this.textPostRepository.deleteById(postId);

    return deletedTextPost;
  }

  public async repostPostById(userId: string, postId: string): Promise<TextPostEntity> {
    const repostTextPost = await this.findPostById(postId);
    if (repostTextPost.authorId === userId) {
      throw new UnauthorizedException(TEXT_POST_REPOST_AUTHOR);
    }

    //todo проверка что был уже репост
    if (false) {
      throw new ConflictException(TEXT_POST_REPOST_EXISTS);
    }

    const createTextPostDto: CreateTextPostDto = {
      tags: repostTextPost.tags,
      title: repostTextPost.title,
      announcement: repostTextPost.announcement,
      text: repostTextPost.text,
    }

    return await this.createPost(userId, createTextPostDto, repostTextPost.id);
  }
}

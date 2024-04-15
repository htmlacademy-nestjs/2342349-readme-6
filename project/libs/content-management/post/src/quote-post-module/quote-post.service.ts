import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { QuotePostEntity, QuotePostRepository } from '@project/content-core';
import { PostType } from '@project/shared-core';
import { CreateQuotePostDto } from './dto/create-quote-post.dto';
import { UpdateQuotePostDto } from './dto/update-quote-post.dto';
import {
  QUOTE_POST_DELETE_PERMISSION,
  QUOTE_POST_MODIFY_PERMISSION,
  QUOTE_POST_NOT_FOUND,
  QUOTE_POST_REPOST_AUTHOR,
  QUOTE_POST_REPOST_EXISTS
} from './quote-post.constant';


@Injectable()
export class QuotePostService {
  constructor(
    @Inject('QuotePostRepository') private readonly quotePostRepository: QuotePostRepository,
  ) {}

  public async createPost(userId: string, dto: CreateQuotePostDto, originalPostId?: string): Promise<QuotePostEntity> {
    const quotePostData = {
      authorId: userId,
      postType: PostType.LINK,
      text: dto.text,
      quoteAuthorId: dto.quoteAuthorId,
      tags: dto.tags ?? [],
      originalPost: originalPostId ?? '',
    };

    const quotePostEntity = new QuotePostEntity(quotePostData);
    await this.quotePostRepository.save(quotePostEntity);

    return quotePostEntity;
  }

  public async findPostById(postId: string): Promise<QuotePostEntity> {
    const foundQuotePost = await this.quotePostRepository.findById(postId);
    if (!foundQuotePost) {
      throw new NotFoundException(QUOTE_POST_NOT_FOUND);
    }

    return foundQuotePost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.quotePostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateQuotePostDto): Promise<QuotePostEntity> {
    const updatedQuotePost = await this.findPostById(postId);
    if (updatedQuotePost.authorId !== userId) {
      throw new UnauthorizedException(QUOTE_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedQuotePost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedQuotePost.postStatus = dto.postStatus;
    if (dto.text !== undefined) updatedQuotePost.text = dto.text;
    if (dto.quoteAuthorId !== undefined) updatedQuotePost.quoteAuthorId = dto.quoteAuthorId;

    return await this.quotePostRepository.update(postId, updatedQuotePost);
  }

  public async deletePostById(userId: string, postId: string): Promise<QuotePostEntity> {
    const deletedQuotePost = await this.findPostById(postId);
    if (deletedQuotePost.authorId !== userId) {
      throw new UnauthorizedException(QUOTE_POST_DELETE_PERMISSION);
    }

    await this.quotePostRepository.deleteById(postId);

    return deletedQuotePost;
  }

  public async repostPostById(userId: string, postId: string): Promise<QuotePostEntity> {
    const repostQuotePost = await this.findPostById(postId);
    if (repostQuotePost.authorId === userId) {
      throw new UnauthorizedException(QUOTE_POST_REPOST_AUTHOR);
    }

    //todo проверка что был уже репост
    if (false) {
      throw new ConflictException(QUOTE_POST_REPOST_EXISTS);
    }

    const createQuotePostDto: CreateQuotePostDto = {
      tags: repostQuotePost.tags,
      quoteAuthorId: repostQuotePost.quoteAuthorId,
      text: repostQuotePost.text,
    }

    return await this.createPost(userId, createQuotePostDto, repostQuotePost.id);
  }
}

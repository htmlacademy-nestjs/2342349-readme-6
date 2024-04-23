import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { QuotePostEntity, QuotePostRepository } from '@project/content-core';
import { PostService } from '@project/post';
import { PostType } from '@project/shared-core';
import { CreateQuotePostDto } from './dto/create-quote-post.dto';
import { UpdateQuotePostDto } from './dto/update-quote-post.dto';
import {
  QUOTE_POST_DELETE_PERMISSION,
  QUOTE_POST_DIFFERENT_TYPE,
  QUOTE_POST_MODIFY_PERMISSION,
  QUOTE_POST_NOT_FOUND,
  QUOTE_POST_REPOST_AUTHOR,
  QUOTE_POST_REPOST_EXISTS
} from './quote-post.constant';


@Injectable()
export class QuotePostService {
  constructor(
    @Inject('QuotePostRepository') private readonly quotePostRepository: QuotePostRepository,
    private readonly postService: PostService,
  ) {}

  public async createPost(userId: string, dto: CreateQuotePostDto, originalPostId?: string): Promise<QuotePostEntity> {
    const quotePostData = {
      authorId: userId,
      postType: PostType.LINK,
      tags: dto.tags ?? [],
      originalPostId: originalPostId ?? '',
      text: dto.text,
      quoteAuthorId: dto.quoteAuthorId,
    };

    const quotePostEntity = new QuotePostEntity(quotePostData);

    return this.quotePostRepository.save(quotePostEntity);
  }

  public async findPostById(postId: string): Promise<QuotePostEntity> {
    const foundQuotePost = await this.quotePostRepository.findById(postId);
    if (!foundQuotePost) {
      throw new NotFoundException(QUOTE_POST_NOT_FOUND);
    }
    if (foundQuotePost.postType !== PostType.QUOTE) {
      throw new BadRequestException(QUOTE_POST_DIFFERENT_TYPE);
    }

    return foundQuotePost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.quotePostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateQuotePostDto): Promise<QuotePostEntity> {
    const updatedQuotePost = await this.findPostById(postId);
    if (updatedQuotePost.postType !== PostType.QUOTE) {
      throw new BadRequestException(QUOTE_POST_DIFFERENT_TYPE);
    }
    if (updatedQuotePost.authorId !== userId) {
      throw new UnauthorizedException(QUOTE_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedQuotePost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedQuotePost.postStatus = dto.postStatus;
    if (dto.text !== undefined) updatedQuotePost.text = dto.text;
    if (dto.quoteAuthorId !== undefined) updatedQuotePost.quoteAuthorId = dto.quoteAuthorId;

    return this.quotePostRepository.update(postId, updatedQuotePost);
  }

  public async deletePostById(userId: string, postId: string): Promise<QuotePostEntity> {
    const deletedQuotePost = await this.findPostById(postId);
    if (deletedQuotePost.authorId !== userId) {
      throw new UnauthorizedException(QUOTE_POST_DELETE_PERMISSION);
    }

    return this.quotePostRepository.deleteById(postId);
  }

  public async repostPostById(userId: string, postId: string): Promise<QuotePostEntity> {
    const repostQuotePost = await this.findPostById(postId);
    if (repostQuotePost.postType !== PostType.QUOTE) {
      throw new BadRequestException(QUOTE_POST_DIFFERENT_TYPE);
    }
    if (repostQuotePost.authorId === userId) {
      throw new UnauthorizedException(QUOTE_POST_REPOST_AUTHOR);
    }

    if (await this.postService.existsRepostByUser(postId, userId)) {
      throw new ConflictException(QUOTE_POST_REPOST_EXISTS);
    }

    const createQuotePostDto: CreateQuotePostDto = {
      tags: repostQuotePost.tags,
      quoteAuthorId: repostQuotePost.quoteAuthorId,
      text: repostQuotePost.text,
    }

    const repostedQuotePost = await this.createPost(userId, createQuotePostDto, repostQuotePost.id);
    await this.postService.incrementRepostCount(postId);

    return repostedQuotePost;
  }
}

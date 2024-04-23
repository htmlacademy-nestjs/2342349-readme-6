import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { PostEntity, PostRepository } from '@project/content-core';
import {
  POST_ALREADY_LIKED,
  POST_ALREADY_UNLIKED,
  POST_DELETE_PERMISSION,
  POST_NOT_FOUND
} from './post.constant';


@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @Inject('PostRepository') private readonly postRepository: PostRepository,
  ) {}

  public async findPostById(postId: string): Promise<PostEntity> {
    const foundPost = await this.postRepository.findById(postId);
    if (!foundPost) {
      throw new NotFoundException(POST_NOT_FOUND);
    }

    return foundPost;
  }

  public async deletePostById(userId: string, postId: string): Promise<PostEntity> {
    const deletedPost = await this.postRepository.findById(postId);
    if (deletedPost.authorId !== userId) {
      throw new UnauthorizedException(POST_DELETE_PERMISSION);
    }

    return this.postRepository.deleteById(postId);
  }

  public async exists(postId: string): Promise<boolean> {
    return this.postRepository.exists(postId);
  }

  public async existsRepostByUser(originalPostId: string, authorId: string): Promise<boolean> {
    return this.postRepository.existsRepostByUser(originalPostId, authorId);
  }

  public async incrementRepostCount(postId: string): Promise<boolean> {
    const isRepostCountUpdated = await this.postRepository.incrementRepostCount(postId);
    if (!isRepostCountUpdated) {
      this.logger.error(`Failed to increment 'repostCount' for Post ID '${postId}'`);
    }

    return isRepostCountUpdated;
  }

  public async incrementCommentCount(postId: string): Promise<boolean> {
    const isCommentCountUpdated = await this.postRepository.incrementCommentCount(postId);
    if (!isCommentCountUpdated) {
      this.logger.error(`Failed to increment 'commentCount' for Post ID '${postId}'`);
    }

    return isCommentCountUpdated;
  }

  public async decrementCommentCount(postId: string): Promise<boolean> {
    const isCommentCountUpdated = await this.postRepository.decrementCommentCount(postId);
    if (!isCommentCountUpdated) {
      this.logger.error(`Failed to decrement 'commentCount' for Post ID '${postId}'`);
    }

    return isCommentCountUpdated;
  }

  public async likePostById(userId: string, postId: string): Promise<PostEntity> {
    const foundPost = await this.findPostById(postId);
    const userLikeIds = foundPost.userLikeIds;
    if (userLikeIds.includes(userId)) {
      throw new BadRequestException(POST_ALREADY_LIKED);
    }

    userLikeIds.push(userId);

    return this.postRepository.likePost(foundPost.id, userLikeIds);
  }

  public async unlikePostById(userId: string, postId: string): Promise<PostEntity> {
    const foundPost = await this.findPostById(postId);
    const userLikeIds = foundPost.userLikeIds;
    if (!userLikeIds.includes(userId)) {
      throw new BadRequestException(POST_ALREADY_UNLIKED);
    }

    const updatedUserLikeIds = userLikeIds.filter(uid => uid !== userId);

    return this.postRepository.unlikePost(foundPost.id, updatedUserLikeIds);
  }
}


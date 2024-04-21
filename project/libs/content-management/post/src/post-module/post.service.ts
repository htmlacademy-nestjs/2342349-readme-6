import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PostEntity, PostRepository } from '@project/content-core';
import { POST_DELETE_PERMISSION, POST_NOT_FOUND } from './post.constant';


@Injectable()
export class PostService {
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
}


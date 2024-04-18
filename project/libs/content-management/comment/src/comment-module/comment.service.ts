import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommentEntity, CommentRepository } from '@project/content-core';
import { PostService } from '@project/post';
import {
  COMMENT_DELETE_PERMISSION,
  COMMENT_MODIFY_PERMISSION,
  COMMENT_NOT_FOUND,
  COMMENT_POST_NOT_FOUND
} from './comment.constant';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject('CommentRepository') private readonly commentRepository: CommentRepository,
    private readonly postService: PostService
  ) {}

  public async createComment(userId: string, postId: string, dto: UpdateCommentDto): Promise<CommentEntity> {
    const commentData = {
      authorId: userId,
      postId: postId,
      text: dto.text
    };

    if (!await this.postService.exists(postId)) {
      throw new NotFoundException(COMMENT_POST_NOT_FOUND);
    }

    const commentEntity = new CommentEntity(commentData);
    return this.commentRepository.save(commentEntity);
  }

  public async findCommentById(commentId: string): Promise<CommentEntity> {
    const foundComment = await this.commentRepository.findById(commentId);
    if (!foundComment) {
      throw new NotFoundException(COMMENT_NOT_FOUND);
    }

    return foundComment;
  }

  public async findAllCommentsByPostId(postId: string): Promise<CommentEntity[]> {
    if (!await this.postService.exists(postId)) {
      throw new NotFoundException(COMMENT_POST_NOT_FOUND);
    }

    const foundComment = await this.commentRepository.findAllByPostId(postId);
    if (!foundComment) {
      throw new NotFoundException(COMMENT_NOT_FOUND);
    }

    return foundComment;
  }

  public async exists(commentId: string): Promise<boolean> {
    return this.commentRepository.exists(commentId);
  }

  public async updateCommentById(userId: string, commentId: string, dto: UpdateCommentDto): Promise<CommentEntity> {
    const updatedComment = await this.commentRepository.findById(commentId);
    if (updatedComment.authorId !== userId) {
      throw new UnauthorizedException(COMMENT_MODIFY_PERMISSION);
    }

    if (dto.text !== undefined) updatedComment.text = dto.text;

    return await this.commentRepository.update(commentId, updatedComment);
  }

  public async deleteCommentById(userId: string, commentId: string): Promise<CommentEntity> {
    const deletedComment = await this.commentRepository.findById(commentId);

    if (deletedComment.authorId !== userId) {
      throw new UnauthorizedException(COMMENT_DELETE_PERMISSION);
    }

    return this.commentRepository.deleteById(commentId);
  }
}

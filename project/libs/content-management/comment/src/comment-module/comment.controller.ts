import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { fillDto } from '@project/shared-helpers';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentRdo } from './rdo/comment.rdo';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @Post('post/:postId/:userId')
  public async createComment(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto
  ): Promise<CommentRdo> {
    //todo userId from token
    const createdComment = await this.commentService.createComment(userId, postId, dto);
    return fillDto(CommentRdo, createdComment.toPOJO());
  }

  @Patch(':commentId/:userId')
  public async updateComment(
    @Param('userId') userId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto
  ): Promise<CommentRdo> {
    //todo userId from token
    const createdComment = await this.commentService.updateCommentById(userId, commentId, dto);
    return fillDto(CommentRdo, createdComment.toPOJO());
  }

  @Get('post/:postId')
  public async getPostComments(
    @Param('postId') postId: string
  ): Promise<CommentRdo> {
    //todo
    return null;
  }

  @Get(':commentId')
  public async getComment(
    @Param('commentId') commentId: string
  ): Promise<CommentRdo> {
    const foundComment = await this.commentService.findCommentById(commentId);
    return fillDto(CommentRdo, foundComment.toPOJO());
  }

  @Delete(':commentId/:userId')
  public async deleteComment(
    @Param('userId') userId: string,
    @Param('commentId') commentId: string,
  ): Promise<CommentRdo> {
    //todo userId from token
    const createdComment = await this.commentService.deleteCommentById(userId, commentId);
    return fillDto(CommentRdo, createdComment.toPOJO());
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { CommentQuery } from './comment.query';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentPaginationRdo } from './rdo/comment-pagination.rdo';
import { CommentRdo } from './rdo/comment.rdo';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(
    private readonly commentService: CommentService
  ) {
  }

  @Post('post/:postId/:userId')
  @ApiOperation({ summary: 'Create a comment' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Comment created', type: CreateCommentDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async createComment(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto
  ): Promise<CommentRdo> {
    this.logger.log(`Attempting to create comment for post: ${postId} by user: ${userId}`);
    //todo userId from token
    const createdComment = await this.commentService.createComment(userId, postId, dto);
    this.logger.log(`Comment created with ID: '${createdComment.id}'`);

    return fillDto(CommentRdo, createdComment.toPOJO());
  }

  @Patch(':commentId/:userId')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiBearerAuth()
  @ApiParam({ name: 'commentId', description: 'Unique identifier of the comment', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment updated', type: UpdateCommentDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async updateComment(
    @Param('userId') userId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() dto: UpdateCommentDto
  ): Promise<CommentRdo> {
    this.logger.log(`Attempting to update comment: ${commentId} by user: ${userId}`);
    //todo userId from token
    const updatedComment = await this.commentService.updateCommentById(userId, commentId, dto);
    this.logger.log(`Comment updated with ID: '${updatedComment.id}'`);

    return fillDto(CommentRdo, updatedComment.toPOJO());
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comments retrieved successfully', type: [CommentPaginationRdo] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async getPostComments(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: CommentQuery
  ): Promise<CommentPaginationRdo> {
    this.logger.log(`Retrieving comments for post ID: '${postId}'`);
    const commentPagination = await this.commentService.findCommentsByPostId(postId, query);
    this.logger.log(`Comments retrieved for post ID: '${postId}'`);

    const transformedCommentPagination = {
      ...commentPagination,
      entities: commentPagination.entities.map((comment) => comment.toPOJO())
    };

    return fillDto(CommentPaginationRdo, transformedCommentPagination);
  }

  @Get(':commentId')
  @ApiOperation({ summary: 'Retrieve a comment by ID' })
  @ApiParam({ name: 'commentId', description: 'Unique identifier of the comment', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment retrieved successfully', type: CommentRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async getComment(
    @Param('commentId', ParseUUIDPipe) commentId: string
  ): Promise<CommentRdo> {
    this.logger.log(`Retrieving comment with ID: '${commentId}'`);
    const foundComment = await this.commentService.findCommentById(commentId);
    this.logger.log(`Comment retrieved with ID: '${foundComment.id}'`);

    return fillDto(CommentRdo, foundComment.toPOJO());
  }

  @Delete(':commentId/:userId')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiBearerAuth()
  @ApiParam({ name: 'commentId', description: 'Unique identifier of the comment', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment deleted', type: CommentRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async deleteComment(
    @Param('userId') userId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string
  ): Promise<CommentRdo> {
    this.logger.log(`Attempting to delete comment: ${commentId} by user: ${userId}`);
    //todo userId from token
    const deletedComment = await this.commentService.deleteCommentById(userId, commentId);
    this.logger.log(`Comment deleted with ID: '${deletedComment.id}'`);

    return fillDto(CommentRdo, deletedComment.toPOJO());
  }
}

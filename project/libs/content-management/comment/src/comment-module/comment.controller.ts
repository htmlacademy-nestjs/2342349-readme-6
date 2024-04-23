import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SortDirection } from '@project/shared-core';
import { fillDto } from '@project/shared-helpers';
import { CommentService } from './comment.service';
import { CommentQuery } from './comment.query';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentPaginationRdo } from './rdo/comment-pagination.rdo';
import { CommentRdo } from './rdo/comment.rdo';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
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
    //todo userId from token
    const createdComment = await this.commentService.createComment(userId, postId, dto);
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
    //todo userId from token
    const createdComment = await this.commentService.updateCommentById(userId, commentId, dto);
    return fillDto(CommentRdo, createdComment.toPOJO());
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit the number of comments returned', type: Number })
  @ApiQuery({ name: 'page', required: false, description: 'Page number of the comments pagination', type: Number })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    description: 'Direction of comments sorting (ASC or DESC)',
    enum: SortDirection
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comments retrieved successfully', type: [CommentPaginationRdo] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async getPostComments(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: CommentQuery
  ): Promise<CommentPaginationRdo> {
    console.log(query);
    const commentPagination = await this.commentService.findCommentsByPostId(postId, query);
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
    const foundComment = await this.commentService.findCommentById(commentId);
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
    //todo userId from token
    const createdComment = await this.commentService.deleteCommentById(userId, commentId);
    return fillDto(CommentRdo, createdComment.toPOJO());
  }
}

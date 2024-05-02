import { Controller, Delete, Get, HttpStatus, Logger, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { PostService } from './post.service';
import { PostRdo } from './rdo/post.rdo';

@ApiTags('Post')
@Controller('post')
export class PostController {
  private readonly logger = new Logger(PostController.name);

  constructor(
    private readonly postService: PostService,
  ) {}

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post retrieved successfully', type: PostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  public async getPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<PostRdo> {
    this.logger.log(`Retrieving post by ID: ${postId}`);
    const foundPost = await this.postService.findPostById(postId);

    return fillDto(PostRdo, foundPost.toPOJO());
  }

  @Post(':postId/like/:userId')
  @ApiOperation({ summary: 'Like a Post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post liked', type: PostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  public async likePost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<PostRdo> {
    this.logger.log(`Liking post ID: ${postId} by user ID: ${userId}`);
    //todo userId from token
    const postAfterLike = await this.postService.likePostById(userId, postId);

    return fillDto(PostRdo, postAfterLike.toPOJO());
  }

  @Delete(':postId/like/:userId')
  @ApiOperation({ summary: 'Unlike a Post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post unliked', type: PostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  public async unlikePost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<PostRdo> {
    this.logger.log(`Unliking post ID: ${postId} by user ID: ${userId}`);
    //todo userId from token
    const postAfterUnlike = await this.postService.unlikePostById(userId, postId);

    return fillDto(PostRdo, postAfterUnlike.toPOJO());
  }

  @Delete(':postId/:userId')
  @ApiOperation({ summary: 'Delete a Post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post deleted', type: PostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  public async deletePost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<PostRdo> {
    this.logger.log(`Deleting post ID: ${postId} by user ID: ${userId}`);
    //todo userId from token
    const deletedPost = await this.postService.deletePostById(userId, postId);

    return fillDto(PostRdo, deletedPost.toPOJO());
  }
}

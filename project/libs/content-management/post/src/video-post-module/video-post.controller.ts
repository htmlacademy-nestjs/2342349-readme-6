import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { CreateVideoPostDto } from './dto/create-video-post.dto';
import { UpdateVideoPostDto } from './dto/update-video-post.dto';
import { VideoPostRdo } from './rdo/video-post.rdo';
import { VideoPostService } from './video-post.service';

@ApiTags('Video-Posts')
@Controller('post/video')
export class VideoPostController {
  private readonly logger = new Logger(VideoPostController.name);

  constructor(
    private readonly videoPostService: VideoPostService,
  ) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a Video-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Video-Post successfully created', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiBearerAuth()
  public async createVideoPost(
    @Param('userId') userId: string,
    @Body() dto: CreateVideoPostDto
  ): Promise<VideoPostRdo> {
    this.logger.log(`Creating video post for user ${userId}`);
    //todo userId from token
    const createdVideoPost = await this.videoPostService.createPost(userId, dto);

    return fillDto(VideoPostRdo, createdVideoPost.toPOJO());
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Video-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Video-Post retrieved successfully', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video-Post not found' })
  public async getVideoPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Retrieving video post ID ${postId}`);
    const foundPost = await this.videoPostService.findPostById(postId);

    return fillDto(VideoPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId/:userId')
  @ApiOperation({ summary: 'Update a Video-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Video-Post updated successfully', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video-Post not found' })
  @ApiBearerAuth()
  public async updateVideoPost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateVideoPostDto
  ): Promise<VideoPostRdo> {
    this.logger.log(`Updating video post ID ${postId} by user ${userId}`);
    //todo userId from token
    const updatedPost = await this.videoPostService.updatePostById(userId, postId, dto);

    return fillDto(VideoPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId/:userId')
  @ApiOperation({ summary: 'Delete a Video-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Video-Post successfully deleted', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video-Post not found' })
  @ApiBearerAuth()
  public async deleteVideoPost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<VideoPostRdo> {
    this.logger.log(`Deleting video post ID ${postId} by user ${userId}`);
    //todo userId from token
    const deletedPost = await this.videoPostService.deletePostById(userId, postId);

    return fillDto(VideoPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost/:userId')
  @ApiOperation({ summary: 'Repost a Video-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Video-Post successfully reposted', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Original Video-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Video-Post has already been reposted' })
  @ApiBearerAuth()
  public async repostVideoPost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<VideoPostRdo> {
    this.logger.log(`Reposting video post ID ${postId} by user ${userId}`);
    //todo userId from token
    const repostedPost = await this.videoPostService.repostPostById(userId, postId);

    return fillDto(VideoPostRdo, repostedPost.toPOJO());
  }
}

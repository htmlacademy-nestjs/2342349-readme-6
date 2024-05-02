import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { CreateTextPostDto } from './dto/create-text-post.dto';
import { UpdateTextPostDto } from './dto/update-text-post.dto';
import { TextPostRdo } from './rdo/text-post.rdo';
import { TextPostService } from './text-post.service';

@ApiTags('Text-Posts')
@Controller('post/text')
export class TextPostController {
  private readonly logger = new Logger(TextPostController.name);

  constructor(
    private readonly textPostService: TextPostService,
  ) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a Text-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Text-Post successfully created', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiBearerAuth()
  public async createTextPost(
    @Param('userId') userId: string,
    @Body() dto: CreateTextPostDto
  ): Promise<TextPostRdo> {
    this.logger.log(`Creating text post for user ${userId}`);
    //todo userId from token
    const createdTextPost = await this.textPostService.createPost(userId, dto);

    return fillDto(TextPostRdo, createdTextPost.toPOJO());
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Text-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Text-Post retrieved successfully', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Text-Post not found' })
  public async getTextPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Retrieving text post ID ${postId}`);
    const foundPost = await this.textPostService.findPostById(postId);

    return fillDto(TextPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId/:userId')
  @ApiOperation({ summary: 'Update a Text-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Text-Post updated successfully', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Text-Post not found' })
  @ApiBearerAuth()
  public async updateTextPost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateTextPostDto
  ): Promise<TextPostRdo> {
    this.logger.log(`Updating text post ID ${postId} by user ${userId}`);
    //todo userId from token
    const updatedPost = await this.textPostService.updatePostById(userId, postId, dto);

    return fillDto(TextPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId/:userId')
  @ApiOperation({ summary: 'Delete a Text-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Text-Post successfully deleted', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Text-Post not found' })
  @ApiBearerAuth()
  public async deleteTextPost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<TextPostRdo> {
    this.logger.log(`Deleting text post ID ${postId} by user ${userId}`);
    //todo userId from token
    const deletedPost = await this.textPostService.deletePostById(userId, postId);

    return fillDto(TextPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost/:userId')
  @ApiOperation({ summary: 'Repost a Text-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Text-Post successfully reposted', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Original Text-Post not found' })
  @ApiBearerAuth()
  public async repostTextPost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<TextPostRdo> {
    this.logger.log(`Reposting text post ID ${postId} by user ${userId}`);
    //todo userId from token
    const repostedPost = await this.textPostService.repostPostById(userId, postId);

    return fillDto(TextPostRdo, repostedPost.toPOJO());
  }
}

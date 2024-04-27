import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { CreateLinkPostDto } from './dto/create-link-post.dto';
import { UpdateLinkPostDto } from './dto/update-link-post.dto';
import { LinkPostService } from './link-post.service';
import { LinkPostRdo } from './rdo/link-post.rdo';

@ApiTags('Link-Post')
@Controller('post/link')
export class LinkPostController {
  constructor(
    private readonly linkPostService: LinkPostService,
  ) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a Link-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Link-Post created', type: CreateLinkPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiBearerAuth()
  public async createLinkPost(
    @Param('userId') userId: string,
    @Body() dto: CreateLinkPostDto
  ): Promise<LinkPostRdo> {
    //todo userId from token
    const createdLinkPost = await this.linkPostService.createPost(userId, dto);
    return fillDto(LinkPostRdo, createdLinkPost.toPOJO());
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Link-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  public async getLinkPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<LinkPostRdo> {
    const foundPost = await this.linkPostService.findPostById(postId);
    return fillDto(LinkPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId/:userId')
  @ApiOperation({ summary: 'Update a Link-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Link-Post updated', type: UpdateLinkPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  @ApiBearerAuth()
  public async updateLinkPost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateLinkPostDto
  ): Promise<LinkPostRdo> {
    //todo userId from token
    const updatedPost = await this.linkPostService.updatePostById(userId, postId, dto);
    return fillDto(LinkPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId/:userId')
  @ApiOperation({ summary: 'Delete a Link-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Link-Post deleted', type: LinkPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  @ApiBearerAuth()
  public async deleteLinkPost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<LinkPostRdo> {
    //todo userId from token
    const deletedPost = await this.linkPostService.deletePostById(userId, postId);
    return fillDto(LinkPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost/:userId')
  @ApiOperation({ summary: 'Repost a Link-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Link-Post reposted', type: LinkPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Link-Post has already been reposted' })
  @ApiBearerAuth()
  public async repostLinkPost(
    @Param('userId') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<LinkPostRdo> {
    //todo userId from token
    const repostedPost = await this.linkPostService.repostPostById(userId, postId);
    return fillDto(LinkPostRdo, repostedPost.toPOJO());
  }
}

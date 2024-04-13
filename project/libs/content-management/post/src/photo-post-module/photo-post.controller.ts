import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { CreatePhotoPostDto } from './dto/create-photo-post.dto';
import { UpdatePhotoPostDto } from './dto/update-photo-post.dto';
import { PhotoPostService } from './photo-post.service';
import { PhotoPostRdo } from './rdo/photo-post.rdo';

@ApiTags('Photo-Post')
@Controller('post/photo')
export class PhotoPostController {
  constructor(
    private readonly photoPostService: PhotoPostService,
  ) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a Photo-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Photo-Post successfully created', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiBearerAuth()
  public async createPhotoPost(
    @Param('userId') userId: string,
    @Body() dto: CreatePhotoPostDto
  ): Promise<PhotoPostRdo> {
    //todo userId from token
    const createdPhotoPost = await this.photoPostService.createPost(userId, dto);
    return fillDto(PhotoPostRdo, createdPhotoPost.toPOJO());
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Photo-Post by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo-Post retrieved successfully', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Photo-Post not found' })
  public async getPhotoPost(
    @Param('postId') postId: string
  ): Promise<PhotoPostRdo> {
    const foundPost = await this.photoPostService.findPostById(postId);
    return fillDto(PhotoPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId/:userId')
  @ApiOperation({ summary: 'Update a Photo-Post' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo-Post updated successfully', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Photo-Post not found' })
  @ApiBearerAuth()
  public async updatePhotoPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdatePhotoPostDto
  ): Promise<PhotoPostRdo> {
    //todo userId from token
    const updatedPost = await this.photoPostService.updatePostById(userId, postId, dto);
    return fillDto(PhotoPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId/:userId')
  @ApiOperation({ summary: 'Delete a Photo-Post' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo-Post successfully deleted', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Photo-Post not found' })
  @ApiBearerAuth()
  public async deletePhotoPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<PhotoPostRdo> {
    //todo userId from token
    const deletedPost = await this.photoPostService.deletePostById(userId, postId);
    return fillDto(PhotoPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost/:userId')
  @ApiOperation({ summary: 'Repost a Photo-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Photo-Post successfully reposted', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Original Photo-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Photo-Post has already been reposted' })
  @ApiBearerAuth()
  public async repostPhotoPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<PhotoPostRdo> {
    //todo userId from token
    const repostedPost = await this.photoPostService.repostPostById(userId, postId);
    return fillDto(PhotoPostRdo, repostedPost.toPOJO());
  }
}

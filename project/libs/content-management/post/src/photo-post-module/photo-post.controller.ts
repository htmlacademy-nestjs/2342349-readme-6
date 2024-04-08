import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { fillDto } from '@project/shared-helpers';
import { CreatePhotoPostDto } from './dto/create-photo-post.dto';
import { UpdatePhotoPostDto } from './dto/update-photo-post.dto';
import { PhotoPostService } from './photo-post.service';
import { PhotoPostRdo } from './rdo/photo-post.rdo';

@Controller('post/photo')
export class PhotoPostController {
  constructor(
    private readonly photoPostService: PhotoPostService,
  ) {}

  @Post(':userId')
  public async createPhotoPost(
    @Param('userId') userId: string,
    @Body() dto: CreatePhotoPostDto
  ): Promise<PhotoPostRdo> {
    //todo userId from token
    const createdPhotoPost = await this.photoPostService.createPost(userId, dto);
    return fillDto(PhotoPostRdo, createdPhotoPost.toPOJO());
  }

  @Get(':postId')
  public async getPhotoPost(
    @Param('postId') postId: string
  ): Promise<PhotoPostRdo> {
    const foundPost = await this.photoPostService.findPostById(postId);
    return fillDto(PhotoPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId/:userId')
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
  public async deletePhotoPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<PhotoPostRdo> {
    //todo userId from token
    const deletedPost = await this.photoPostService.deletePostById(userId, postId);
    return fillDto(PhotoPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost/:userId')
  public async repostPhotoPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<PhotoPostRdo> {
    //todo userId from token
    const repostedPost = await this.photoPostService.repostPostById(userId, postId);
    return fillDto(PhotoPostRdo, repostedPost.toPOJO());
  }

}

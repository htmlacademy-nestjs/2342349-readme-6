import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { fillDto } from '@project/shared-helpers';
import { VideoPostRdo } from '../text-post-module/rdo/video-post.rdo';
import { CreateVideoPostDto } from './dto/create-video-post.dto';
import { UpdateVideoPostDto } from './dto/update-video-post.dto';
import { VideoPostService } from './video-post.service';

@Controller('post/video')
export class VideoPostController {
  constructor(
    private readonly videoPostService: VideoPostService,
  ) {}

  @Post(':userId')
  public async createVideoPost(
    @Param('userId') userId: string,
    @Body() dto: CreateVideoPostDto
  ): Promise<VideoPostRdo> {
    //todo userId from token
    const createdVideoPost = await this.videoPostService.createPost(userId, dto);
    return fillDto(VideoPostRdo, createdVideoPost.toPOJO());
  }

  @Get(':postId')
  public async getVideoPost(
    @Param('postId') postId: string
  ): Promise<VideoPostRdo> {
    const foundPost = await this.videoPostService.findPostById(postId);
    return fillDto(VideoPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId/:userId')
  public async updateVideoPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdateVideoPostDto
  ): Promise<VideoPostRdo> {
    //todo userId from token
    const updatedPost = await this.videoPostService.updatePostById(userId, postId, dto);
    return fillDto(VideoPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId/:userId')
  public async deleteVideoPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<VideoPostRdo> {
    //todo userId from token
    const deletedPost = await this.videoPostService.deletePostById(userId, postId);
    return fillDto(VideoPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost/:userId')
  public async repostVideoPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<VideoPostRdo> {
    //todo userId from token
    const repostedPost = await this.videoPostService.repostPostById(userId, postId);
    return fillDto(VideoPostRdo, repostedPost.toPOJO());
  }
}

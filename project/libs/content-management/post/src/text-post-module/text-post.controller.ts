import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { fillDto } from '@project/shared-helpers';
import { CreateTextPostDto } from './dto/create-text-post.dto';
import { UpdateTextPostDto } from './dto/update-text-post.dto';
import { TextPostRdo } from './rdo/text-post.rdo';
import { TextPostService } from './text-post.service';

@Controller('post/text')
export class TextPostController {
  constructor(
    private readonly textPostService: TextPostService,
  ) {}

  @Post(':userId')
  public async createTextPost(
    @Param('userId') userId: string,
    @Body() dto: CreateTextPostDto
  ): Promise<TextPostRdo> {
    //todo userId from token
    const createdTextPost = await this.textPostService.createPost(userId, dto);
    return fillDto(TextPostRdo, createdTextPost.toPOJO());
  }

  @Get(':postId')
  public async getTextPost(
    @Param('postId') postId: string
  ): Promise<TextPostRdo> {
    const foundPost = await this.textPostService.findPostById(postId);
    return fillDto(TextPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId/:userId')
  public async updateTextPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdateTextPostDto
  ): Promise<TextPostRdo> {
    //todo userId from token
    const updatedPost = await this.textPostService.updatePostById(userId, postId, dto);
    return fillDto(TextPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId/:userId')
  public async deleteTextPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<TextPostRdo> {
    //todo userId from token
    const deletedPost = await this.textPostService.deletePostById(userId, postId);
    return fillDto(TextPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost/:userId')
  public async repostTextPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<TextPostRdo> {
    //todo userId from token
    const repostedPost = await this.textPostService.repostPostById(userId, postId);
    return fillDto(TextPostRdo, repostedPost.toPOJO());
  }
}

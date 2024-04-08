import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { fillDto } from '@project/shared-helpers';
import { CreateLinkPostDto } from './dto/create-link-post.dto';
import { UpdateLinkPostDto } from './dto/update-link-post.dto';
import { LinkPostService } from './link-post.service';
import { LinkPostRdo } from './rdo/link-post.rdo';

@Controller('post/link')
export class LinkPostController {
  constructor(
    private readonly linkPostService: LinkPostService,
  ) {}

  @Post(':userId')
  public async createLinkPost(
    @Param('userId') userId: string,
    @Body() dto: CreateLinkPostDto
  ): Promise<LinkPostRdo> {
    //todo userId from token
    const createdLinkPost = await this.linkPostService.createPost(userId, dto);
    return fillDto(LinkPostRdo, createdLinkPost.toPOJO());
  }

  @Get(':postId')
  public async getLinkPost(
    @Param('postId') postId: string
  ): Promise<LinkPostRdo> {
    const foundPost = await this.linkPostService.findPostById(postId);
    return fillDto(LinkPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId/:userId')
  public async updateLinkPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdateLinkPostDto
  ): Promise<LinkPostRdo> {
    //todo userId from token
    const updatedPost = await this.linkPostService.updatePostById(userId, postId, dto);
    return fillDto(LinkPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId/:userId')
  public async deleteLinkPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<LinkPostRdo> {
    //todo userId from token
    const deletedPost = await this.linkPostService.deletePostById(userId, postId);
    return fillDto(LinkPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost/:userId')
  public async repostLinkPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<LinkPostRdo> {
    //todo userId from token
    const repostedPost = await this.linkPostService.repostPostById(userId, postId);
    return fillDto(LinkPostRdo, repostedPost.toPOJO());
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { fillDto } from '@project/shared-helpers';
import { CreateQuotePostDto } from './dto/create-quote-post.dto';
import { UpdateQuotePostDto } from './dto/update-quote-post.dto';
import { QuotePostService } from './quote-post.service';
import { QuotePostRdo } from './rdo/quote-post.rdo';

@Controller('post/quote')
export class QuotePostController {
  constructor(
    private readonly quotePostService: QuotePostService,
  ) {}

  @Post(':userId')
  public async createQuotePost(
    @Param('userId') userId: string,
    @Body() dto: CreateQuotePostDto
  ): Promise<QuotePostRdo> {
    //todo userId from token
    const createdQuotePost = await this.quotePostService.createPost(userId, dto);
    return fillDto(QuotePostRdo, createdQuotePost.toPOJO());
  }

  @Get(':postId')
  public async getQuotePost(
    @Param('postId') postId: string
  ): Promise<QuotePostRdo> {
    const foundPost = await this.quotePostService.findPostById(postId);
    return fillDto(QuotePostRdo, foundPost.toPOJO());
  }

  @Patch(':postId/:userId')
  public async updateQuotePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdateQuotePostDto
  ): Promise<QuotePostRdo> {
    //todo userId from token
    const updatedPost = await this.quotePostService.updatePostById(userId, postId, dto);
    return fillDto(QuotePostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId/:userId')
  public async deleteQuotePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<QuotePostRdo> {
    //todo userId from token
    const deletedPost = await this.quotePostService.deletePostById(userId, postId);
    return fillDto(QuotePostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost/:userId')
  public async repostQuotePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<QuotePostRdo> {
    //todo userId from token
    const repostedPost = await this.quotePostService.repostPostById(userId, postId);
    return fillDto(QuotePostRdo, repostedPost.toPOJO());
  }
}

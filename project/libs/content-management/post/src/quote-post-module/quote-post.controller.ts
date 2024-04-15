import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { CreateQuotePostDto } from './dto/create-quote-post.dto';
import { UpdateQuotePostDto } from './dto/update-quote-post.dto';
import { QuotePostService } from './quote-post.service';
import { QuotePostRdo } from './rdo/quote-post.rdo';

@ApiTags('Quote-Posts')
@Controller('post/quote')
export class QuotePostController {
  constructor(
    private readonly quotePostService: QuotePostService,
  ) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a Quote-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Quote-Post successfully created', type: QuotePostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiBearerAuth()
  public async createQuotePost(
    @Param('userId') userId: string,
    @Body() dto: CreateQuotePostDto
  ): Promise<QuotePostRdo> {
    //todo userId from token
    const createdQuotePost = await this.quotePostService.createPost(userId, dto);
    return fillDto(QuotePostRdo, createdQuotePost.toPOJO());
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Quote-Post by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Quote-Post retrieved successfully', type: QuotePostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quote-Post not found' })
  public async getQuotePost(
    @Param('postId') postId: string
  ): Promise<QuotePostRdo> {
    const foundPost = await this.quotePostService.findPostById(postId);
    return fillDto(QuotePostRdo, foundPost.toPOJO());
  }

  @Patch(':postId/:userId')
  @ApiOperation({ summary: 'Delete a Quote-Post' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Quote-Post successfully deleted', type: QuotePostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quote-Post not found' })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Repost a Quote-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Quote-Post successfully reposted', type: QuotePostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Original Quote-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Quote-Post has already been reposted' })
  @ApiBearerAuth()
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

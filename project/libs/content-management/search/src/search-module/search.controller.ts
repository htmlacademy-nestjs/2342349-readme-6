import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { PersonaFeedQuery } from './persona-feed-search.query';
import { PostSearchQuery } from './post-search.query';
import { AggregatePostPaginationRdo } from './rdo/aggregate-post-pagination.rdo';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService
  ) {
  }

  @Get('personal-feed/:userId')
  @ApiOperation({ summary: 'Search personal feed posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Personal feed Posts retrieved successfully', type: [AggregatePostPaginationRdo] })
  public async getPersonalFeedPosts(
    @Param('userId') userId: string,
    @Query() query: PersonaFeedQuery
  ): Promise<AggregatePostPaginationRdo> {
    //todo userId from token
    //todo subscriptionIds from User
    const subscriptionIds = ['author-uuid-003', 'author-uuid-004'];
    const postPagination = await this.searchService.findPersonalFeedPosts(userId, subscriptionIds, query);
    const transformedPostPagination = {
      ...postPagination,
      entities: postPagination.entities.map((post) => post.toPOJO())
    };

    return fillDto(AggregatePostPaginationRdo, transformedPostPagination);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Search posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Posts retrieved successfully', type: [AggregatePostPaginationRdo] })
  public async getPosts(
    @Param('userId') userId: string,
    @Query() query: PostSearchQuery
  ): Promise<AggregatePostPaginationRdo> {
    //todo userId from token
    const postPaginationResults = await this.searchService.findPosts(userId, query);
    const transformedPostPagination = {
      ...postPaginationResults,
      entities: postPaginationResults.entities.map((post) => post.toPOJO())
    };

    return fillDto(AggregatePostPaginationRdo, transformedPostPagination);
  }
}

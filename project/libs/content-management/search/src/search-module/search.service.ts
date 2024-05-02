import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApplicationConfig } from '@project/content-config';
import { SearchRepository } from '@project/content-core';
import { AggregatePostRdo } from '@project/search';
import { PaginationResult, PostStatus, SortDirection, SortType } from '@project/shared-core';
import { PostSearchQuery } from './post-search.query';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly defaultPage = 1;

  constructor(
    @Inject('SearchRepository') private readonly postRepository: SearchRepository,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  public async findNewPostsByDate(postDate: Date, searchQuery?: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>> {
    this.logger.log(`Searching for new posts on date ${postDate}`);
    if (!searchQuery) {
      searchQuery = new PostSearchQuery();
    }
    searchQuery.authorIds = [];
    searchQuery.postStatus = PostStatus.PUBLISHED;
    searchQuery.postDate = postDate;

    return this.findPosts(searchQuery);
  }

  public async findPersonalFeedPosts(subscriptionIds: string[], searchQuery?: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>> {
    this.logger.log(`Searching personal feed posts`);
    if (!searchQuery) {
      searchQuery = new PostSearchQuery();
    }
    searchQuery.authorIds = subscriptionIds;
    searchQuery.postStatus = PostStatus.PUBLISHED;

    return this.findPosts(searchQuery);
  }

  public async findUserSearchPosts(userId: string, searchQuery?: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>> {
    this.logger.log(`Searching posts by user ${userId}`);
    if (!searchQuery) {
      searchQuery = new PostSearchQuery();
    }
    searchQuery.authorIds = searchQuery?.authorIds ?? [userId];
    if (searchQuery.authorIds.length > 1 || searchQuery.authorIds[0] !== userId) {
      searchQuery.postStatus = PostStatus.PUBLISHED;
    }

    return this.findPosts(searchQuery);
  }

  private async findPosts(searchQuery?: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>> {
    this.logger.log(`Finding posts with query parameters: ${JSON.stringify(searchQuery)}`);
    const limit = Math.min(searchQuery?.limit ?? Number.MAX_VALUE, this.applicationConfig.defaultPostCountLimit);
    const page = searchQuery?.page ?? this.defaultPage;
    const sortDirection = searchQuery?.sortDirection ?? SortDirection.DESC;
    const sortType = searchQuery?.sortType ?? SortType.BY_DATE;
    const authorIds = searchQuery?.authorIds;
    const postStatus = searchQuery?.postStatus;
    const postType = searchQuery?.postType;
    const tags = (searchQuery?.tags ?? []).map(tag => tag.toLowerCase());
    const title = searchQuery?.title ? searchQuery.title.toLowerCase(): undefined;

    const searchResults = await this.postRepository.searchPosts({
      page, limit, title, authorIds, postType, tags, sortDirection, sortType, postStatus
    });
    this.logger.log(`Posts found: ${searchResults.entities.length} for query ${JSON.stringify(searchQuery)}`);

    return searchResults;
  }
}

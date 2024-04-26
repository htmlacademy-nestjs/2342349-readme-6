import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApplicationConfig } from '@project/content-config';
import { SearchRepository } from '@project/content-core';
import { AggregatePostRdo } from '@project/search';
import { PaginationResult, PostStatus, SortDirection, SortType } from '@project/shared-core';
import { PersonaFeedQuery } from './persona-feed-search.query';
import { PostSearchQuery } from './post-search.query';

@Injectable()
export class SearchService {
  private readonly defaultPage = 1;

  constructor(
    @Inject('SearchRepository') private readonly postRepository: SearchRepository,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  public async findPersonalFeedPosts(userId: string, subscriptionIds: string[], personaFeedQuery?: PersonaFeedQuery): Promise<PaginationResult<AggregatePostRdo>> {
    personaFeedQuery.authorIds = subscriptionIds;
    return this.findPosts(userId, personaFeedQuery);
  }

  public async findPosts(userId: string, searchQuery?: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>> {
    const limit = Math.min(searchQuery?.limit ?? Number.MAX_VALUE, this.applicationConfig.defaultPostCountLimit);
    const page = searchQuery?.page ?? this.defaultPage;
    const sortDirection = searchQuery?.sortDirection ?? SortDirection.DESC;
    const sortType = searchQuery?.sortType ?? SortType.BY_DATE;
    const authorIds = searchQuery?.authorIds ?? [userId];
    const postStatus = searchQuery?.authorIds && searchQuery.authorIds.length > 0 ? PostStatus.PUBLISHED : undefined;
    const postType = searchQuery?.postType;
    const tags = (searchQuery?.tags ?? []).map(tag => tag.toLowerCase());
    const title = searchQuery?.title ? searchQuery.title.toLowerCase(): undefined;

    return this.postRepository.searchPosts({
      page, limit, title, authorIds: authorIds, postType, tags, sortDirection, sortType, postStatus
    });
  }
}

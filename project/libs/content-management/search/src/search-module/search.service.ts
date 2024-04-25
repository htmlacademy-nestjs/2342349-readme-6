import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApplicationConfig } from '@project/content-config';
import { PostEntity, PostRepository } from '@project/content-core';
import { PaginationResult, PostStatus, SortDirection, SortType } from '@project/shared-core';
import { PersonaFeedQuery } from './persona-feed-search.query';
import { PostSearchQuery } from './post-search.query';

@Injectable()
export class SearchService {
  private readonly defaultPage = 1;

  constructor(
    @Inject('PostRepository') private readonly postRepository: PostRepository,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  public async findPersonalFeedPosts(userId: string, postQuery?: PersonaFeedQuery): Promise<PaginationResult<PostEntity>> {

    return null;
  }

  public async findPosts(userId: string, postQuery?: PostSearchQuery): Promise<PaginationResult<PostEntity>> {
    const limit = Math.min(postQuery?.limit ?? Number.MAX_VALUE, this.applicationConfig.defaultPostCountLimit);
    const page = postQuery?.page ?? this.defaultPage;
    const sortDirection = postQuery?.sortDirection ?? SortDirection.DESC;
    const sortType = postQuery?.sortType ?? SortType.BY_DATE;
    const authorId = postQuery?.authorId ?? userId;
    const postStatus = authorId === userId ? undefined : PostStatus.PUBLISHED;
    const postType = postQuery?.postType;
    const tags = (postQuery?.tags ?? []).map(tag => tag.toLowerCase());
    const title = postQuery?.title ? postQuery.title.toLowerCase(): undefined;

    const searchResults = await this.postRepository.searchPosts({
      page, limit, title, authorId, postType, tags, sortDirection, sortType, postStatus
    });

    return searchResults;
  }
}

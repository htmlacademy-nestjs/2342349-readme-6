import { PostStatus } from '@project/shared-core';

export class UpdateQuotePostDto {
  public tags: string[];
  public postStatus: PostStatus;
  public text?: string;
  public quoteAuthor?: string;
}

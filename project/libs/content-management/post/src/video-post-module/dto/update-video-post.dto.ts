import { PostStatus } from '@project/shared-core';

export class UpdateVideoPostDto {
  public tags: string[];
  public postStatus: PostStatus;
  public title?: string;
  public url?: string;
}

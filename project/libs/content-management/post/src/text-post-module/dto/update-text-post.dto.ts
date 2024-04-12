import { PostStatus } from '@project/shared-core';

export class UpdateTextPostDto {
  public tags: string[];
  public postStatus: PostStatus;
  public title?: string;
  public announcement?: string
  public text?: string;
}

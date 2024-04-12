import { PostStatus } from '@project/shared-core';

export class UpdateLinkPostDto {
  public tags: string[];
  public postStatus: PostStatus;
  public url?: string;
  public description?: string;
}

import { PostStatus } from '@project/shared-core';

export class UpdatePhotoPostDto {
  public tags: string[];
  public postStatus: PostStatus;
  public url?: string;
}

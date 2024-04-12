import { PostStatus, PostType } from '@project/shared-core';
import { Expose } from 'class-transformer';

export class PostRdo {
  @Expose()
  public id: string;

  @Expose()
  public tags: string[];

  @Expose()
  public author: string;

  @Expose()
  public postedAt: Date;

  @Expose()
  public createdAt: Date;

  @Expose()
  public postStatus: PostStatus;

  @Expose()
  public originalPost: string;

  @Expose()
  public postType: PostType;

  @Expose()
  public userLikes: string[];

  @Expose()
  public likeCount: number;

  @Expose()
  public commentCount: number;

  @Expose()
  public repostCount: number;
}

import { Entity, Post, PostStatus, PostType, StorableEntity } from '@project/shared-core';

export abstract class PostEntity extends Entity implements StorableEntity<Post> {
  public tags: string[];
  public authorId: string;
  public postedAt: Date;
  public createdAt: Date;
  public postStatus: PostStatus;
  public originalPostId: string;
  public postType: PostType;
  public userLikeIds: string[];
  public likeCount: number;
  public commentCount: number;
  public repostCount: number;

  protected constructor(post?: Post) {
    super();
    this.populate(post);
  }

  public populate(post?: Post): void {
    if (!post) {
      return;
    }

    this.id = post.id ?? '';
    this.tags = post.tags ?? [];
    this.authorId = post.author;
    this.postedAt = post.postedAt ?? new Date();
    this.createdAt = post.createdAt ?? new Date();
    this.postStatus = post.postStatus ?? PostStatus.PUBLISHED;
    this.originalPostId = post.originalPost ?? '';
    this.postType = post.postType;
    this.userLikeIds = post.userLikes ?? [];
    this.likeCount = post.likeCount ?? 0;
    this.commentCount = post.commentCount ?? 0;
    this.repostCount = post.repostCount ?? 0;
  }

  public toPOJO() {
    return {
      id: this.id,
      tags: this.tags,
      author: this.authorId,
      postedAt: this.postedAt,
      createdAt: this.createdAt,
      postStatus: this.postStatus,
      originalPost: this.originalPostId,
      postType: this.postType,
      userLikes: this.userLikeIds,
      likeCount: this.likeCount,
      commentCount: this.commentCount,
      repostCount: this.repostCount,
    };
  }
}
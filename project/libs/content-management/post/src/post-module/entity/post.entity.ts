import { Entity, Post, PostStatus, PostType, StorableEntity } from '@project/shared-core';

export abstract class PostEntity extends Entity implements StorableEntity<Post> {
  public tags: string[];
  public authorId: string;
  public postedAt: Date;
  public createdAt: Date;
  public status: PostStatus;
  public originalPost: PostEntity;
  public type: PostType;
  public userLikes: string[];
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

    this.id = this.id ?? '';
    this.tags = post.tags;
    this.authorId = post.author;
    this.postedAt = post.postedAt;
    this.createdAt = post.createdAt;
    this.status = post.status;
    this.type = post.type;
    this.userLikes = post.userLikes;
    this.likeCount = post.likeCount;
    this.commentCount = post.commentCount;
    this.repostCount = post.repostCount;
  }

  public toPOJO() {
    return {
      id: this.id,
      tags: this.tags,
      author: this.authorId,
      postedAt: this.postedAt,
      createdAt: this.createdAt,
      status: this.status,
      originalPost: '',
      type: this.type,
      userLikes: this.userLikes,
      likeCount: this.likeCount,
      commentCount: this.commentCount,
      repostCount: this.repostCount,
    };
  }
}

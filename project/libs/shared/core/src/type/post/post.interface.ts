import { PostStatus } from './post-status.enum';
import { PostType } from './post-type.enum';

export interface Post {
  id?: string;
  tags?: string[];
  author?: string;
  postedAt?: Date;
  createdAt?: Date;
  postStatus?: PostStatus;
  originalPost?: string;
  postType: PostType;
  userLikes?: string[];
  likeCount?: number;
  commentCount?: number;
  repostCount?: number;
}

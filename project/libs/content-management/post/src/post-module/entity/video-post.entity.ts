import { VideoPost } from '@project/shared-core';
import { PostEntity } from './post.entity';

export class VideoPostEntity extends PostEntity  {
  public title: string;
  public url: string;

  constructor(videoPost?: VideoPost) {
    super();
    this.populate(videoPost);
  }

  public populate(videoPost?: VideoPost): void {
    if (!videoPost) {
      return;
    }

    this.title = videoPost.title;
    this.url = videoPost.url;
  }

  public toPOJO() {
    return {
      ...super.toPOJO(),
      title: this.title,
      url: this.url,
    };
  }
}

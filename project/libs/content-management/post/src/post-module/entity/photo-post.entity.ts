import { PhotoPost } from '@project/shared-core';
import { PostEntity } from './post.entity';

export class PhotoPostEntity extends PostEntity  {
  public url: string;

  constructor(photoPost?: PhotoPost) {
    super();
    this.populate(photoPost);
  }

  public populate(photoPost?: PhotoPost): void {
    if (!photoPost) {
      return;
    }

    this.url = photoPost.url;
  }

  public toPOJO() {
    return {
      ...super.toPOJO(),
      url: this.url,
    };
  }
}

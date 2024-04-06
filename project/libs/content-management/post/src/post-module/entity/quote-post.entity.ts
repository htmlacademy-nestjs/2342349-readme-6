import { QuotePost } from '@project/shared-core';
import { PostEntity } from './post.entity';

export class QuotePostEntity extends PostEntity  {
  public text: string;
  public quoteAuthorId: string;

  constructor(quotePost?: QuotePost) {
    super();
    this.populate(quotePost);
  }

  public populate(quotePost?: QuotePost): void {
    if (!quotePost) {
      return;
    }

    this.text = quotePost.text;
    this.quoteAuthorId = quotePost.quoteAuthor;
  }

  public toPOJO() {
    return {
      ...super.toPOJO(),
      text: this.text,
      quoteAuthor: this.quoteAuthorId,
    };
  }
}

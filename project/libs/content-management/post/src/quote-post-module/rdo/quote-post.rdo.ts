import { Expose } from 'class-transformer';
import { PostRdo } from '../../post-module/rdo/post.rdo';

export class QuotePostRdo extends PostRdo {
  @Expose()
  public text: string;

  @Expose()
  public quoteAuthor: string;
}

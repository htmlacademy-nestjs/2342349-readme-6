import { Expose } from 'class-transformer';
import { PostRdo } from './post.rdo';

export class AggregatePostRdo extends PostRdo {
  @Expose()
  public url?: string;

  @Expose()
  public description?: string;

  @Expose()
  public text?: string;

  @Expose()
  public quoteAuthor?: string;

  @Expose()
  public title?: string;

  @Expose()
  public announcement?: string
}

import { Expose } from 'class-transformer';
import { PostRdo } from '../../post-module/rdo/post.rdo';

export class TextPostRdo extends PostRdo {
  @Expose()
  public title: string;

  @Expose()
  public announcement: string

  @Expose()
  public text: string;
}

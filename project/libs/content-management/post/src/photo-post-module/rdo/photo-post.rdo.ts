import { Expose } from 'class-transformer';
import { PostRdo } from '../../post-module/rdo/post.rdo';

export class PhotoPostRdo extends PostRdo {
  @Expose()
  public url: string;
}

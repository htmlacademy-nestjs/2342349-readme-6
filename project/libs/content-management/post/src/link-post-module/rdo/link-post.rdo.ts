import { Expose } from 'class-transformer';
import { PostRdo } from '../../post-module/rdo/post.rdo';

export class LinkPostRdo extends PostRdo {
  @Expose()
  public url: string;

  @Expose()
  public description: string;
}

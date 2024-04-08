import { Expose } from 'class-transformer';
import { PostRdo } from '../../post-module/rdo/post.rdo';

export class VideoPostRdo extends PostRdo {
  @Expose()
  public title: string;

  @Expose()
  public url: string;
}

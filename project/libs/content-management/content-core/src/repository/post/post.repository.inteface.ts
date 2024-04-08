import { Repository } from '@project/data-access';
import { PostEntity } from '../../entity/post/post.entity';

export interface PostRepository extends Repository<PostEntity> {
}

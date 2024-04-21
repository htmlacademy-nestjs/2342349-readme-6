import { Repository } from '@project/data-access';
import { CommentEntity } from '../../entity/comment/comment.entity';

export interface CommentRepository extends Repository<CommentEntity> {
  findAllByPostId(postId: string): Promise<CommentEntity[]>;
}

import { Repository } from '@project/data-access';
import { PaginationResult, SortDirection } from '@project/shared-core';
import { CommentEntity } from '../../entity/comment/comment.entity';

export interface CommentRepository extends Repository<CommentEntity> {
  findAllByPostId(
    postId: string,
    limit: number,
    sortDirection: SortDirection,
    page: number
  ): Promise<PaginationResult<CommentEntity>>;
}

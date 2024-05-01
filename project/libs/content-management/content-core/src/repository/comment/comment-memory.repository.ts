import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';
import { PaginationResult, SortDirection } from '@project/shared-core';
import { CommentEntity } from '../../entity/comment/comment.entity';
import { CommentFactory } from '../../entity/comment/comment.factory';
import { CommentRepository } from './comment.repository.interface';

@Injectable()
export class CommentMemoryRepository extends BaseMemoryRepository<CommentEntity> implements CommentRepository {
  constructor(entityFactory: CommentFactory) {
    super(entityFactory);
  }

  public async findAllByPostId(postId: string, limit: number, sortDirection: SortDirection, page: number): Promise<PaginationResult<CommentEntity>> {
    throw new Error('Not implemented');
  }
}

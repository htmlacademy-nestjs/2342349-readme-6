import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';
import { CommentEntity } from '../../entity/comment/comment.entity';
import { CommentFactory } from '../../entity/comment/comment.factory';
import { CommentRepository } from './comment.repository.inteface';

@Injectable()
export class CommentMemoryRepository extends BaseMemoryRepository<CommentEntity> implements CommentRepository {
  constructor(entityFactory: CommentFactory) {
    super(entityFactory);
  }

  public async findAllByPostId(postId: string): Promise<CommentEntity[]> {
    throw new Error('Not implemented');
  }
}

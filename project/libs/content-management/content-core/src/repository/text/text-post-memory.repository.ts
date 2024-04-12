import { Injectable } from '@nestjs/common';
import { TextPostEntity } from '../../entity/text/text-post.entity';
import { TextPostFactory } from '../../entity/text/text-post.factory';
import { PostMemoryRepository } from '../post/post-memory.repository';
import { TextPostRepository } from './text-post.repository.inteface';

@Injectable()
export class TextPostMemoryRepository extends PostMemoryRepository<TextPostEntity> implements TextPostRepository {
  constructor(entityFactory: TextPostFactory) {
    super(entityFactory);
  }
}

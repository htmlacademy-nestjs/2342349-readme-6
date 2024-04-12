import { Injectable } from '@nestjs/common';
import { LinkPostEntity } from '../../entity/link/link-post.entity';
import { LinkPostFactory } from '../../entity/link/link-post.factory';
import { PostMemoryRepository } from '../post/post-memory.repository';
import { LinkPostRepository } from './link-post.repository.inteface';

@Injectable()
export class LinkPostMemoryRepository extends PostMemoryRepository<LinkPostEntity> implements LinkPostRepository {
  constructor(entityFactory: LinkPostFactory) {
    super(entityFactory);
  }
}

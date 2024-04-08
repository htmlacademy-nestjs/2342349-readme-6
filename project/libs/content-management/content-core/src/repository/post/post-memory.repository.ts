import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';
import { EntityFactory, StorableEntity } from '@project/shared-core';
import { PostEntity } from '../../entity/post/post.entity';
import { PostRepository } from './post.repository.inteface';

@Injectable()
export abstract class PostMemoryRepository<T extends PostEntity & StorableEntity<ReturnType<T['toPOJO']>>> extends BaseMemoryRepository<T> implements PostRepository {
  protected constructor(entityFactory: EntityFactory<T>) {
    super(entityFactory);
  }
}

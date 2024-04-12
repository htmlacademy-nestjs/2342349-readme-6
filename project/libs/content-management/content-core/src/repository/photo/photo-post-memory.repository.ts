import { Injectable } from '@nestjs/common';
import { PhotoPostEntity } from '../../entity/photo/photo-post.entity';
import { PhotoPostFactory } from '../../entity/photo/photo-post.factory';
import { PostMemoryRepository } from '../post/post-memory.repository';
import { PhotoPostRepository } from './photo-post.repository.inteface';

@Injectable()
export class PhotoPostMemoryRepository extends PostMemoryRepository<PhotoPostEntity> implements PhotoPostRepository {
  constructor(entityFactory: PhotoPostFactory) {
    super(entityFactory);
  }
}

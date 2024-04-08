import { Injectable } from '@nestjs/common';
import { VideoPostEntity } from '../../entity/video/video-post.entity';
import { VideoPostFactory } from '../../entity/video/video-post.factory';
import { PostMemoryRepository } from '../post/post-memory.repository';
import { VideoPostRepository } from './video-post.repository.inteface';

@Injectable()
export class VideoPostMemoryRepository extends PostMemoryRepository<VideoPostEntity> implements VideoPostRepository {
  constructor(entityFactory: VideoPostFactory) {
    super(entityFactory);
  }
}

import { Repository } from '@project/data-access';
import { VideoPostEntity } from '../../entity/video/video-post.entity';

export interface VideoPostRepository extends Repository<VideoPostEntity> {
}

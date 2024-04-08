import { Repository } from '@project/data-access';
import { PhotoPostEntity } from '../../entity/photo/photo-post.entity';

export interface PhotoPostRepository extends Repository<PhotoPostEntity> {
}

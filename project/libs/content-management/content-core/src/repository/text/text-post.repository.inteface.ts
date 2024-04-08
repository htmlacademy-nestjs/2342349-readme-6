import { Repository } from '@project/data-access';
import { TextPostEntity } from '../../entity/text/text-post.entity';

export interface TextPostRepository extends Repository<TextPostEntity> {
}

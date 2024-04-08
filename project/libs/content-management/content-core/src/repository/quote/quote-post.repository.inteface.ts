import { Repository } from '@project/data-access';
import { QuotePostEntity } from '../../entity/quote/quote-post.entity';

export interface QuotePostRepository extends Repository<QuotePostEntity> {
}

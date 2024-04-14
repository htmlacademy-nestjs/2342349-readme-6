import { Repository } from '@project/data-access';
import { UserEntity } from '../entity/user.entity';

export interface UserRepository extends Repository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;

  containsSubscription(userId: string, subscriptionId: string): Promise<boolean>;

  addSubscription(userId: string, subscriptionId: string): Promise<UserEntity>;

  removeSubscription(userId: string, subscriptionId: string): Promise<UserEntity>;
}

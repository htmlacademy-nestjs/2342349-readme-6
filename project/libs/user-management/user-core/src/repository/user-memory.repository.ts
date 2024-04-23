import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';
import { UserEntity } from '../entity/user.entity';
import { UserFactory } from '../entity/user.factory';
import { UserRepository } from './user.repository.inteface';

@Injectable()
export class UserMemoryRepository extends BaseMemoryRepository<UserEntity> implements UserRepository {
  constructor(entityFactory: UserFactory) {
    super(entityFactory);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const userEntities = Array.from(this.entities.values());
    const foundUser = userEntities.find((entity) => entity.email === email);

    if (!foundUser) {
      return null;
    }

    return this.entityFactory.create(foundUser);
  }

  public async containsSubscription(userId: string, subscriptionId: string): Promise<boolean> {
    const currentUser= await this.findById(userId);
    return currentUser.subscriptionIds.includes(subscriptionId);
  }

  public async addSubscription(userId: string, subscriptionId: string): Promise<UserEntity> {
    const currentUser= await this.findById(userId);

    currentUser.subscriptionIds.push(subscriptionId);
    return this.update(userId, currentUser);
  }

  public async removeSubscription(userId: string, unsubscribeUserId: string): Promise<UserEntity> {
    const currentUser= await this.findById(userId);

    currentUser.subscriptionIds = currentUser.subscriptionIds.filter(subscriptionId => subscriptionId !== unsubscribeUserId);
    return this.update(userId, currentUser);
  }
}

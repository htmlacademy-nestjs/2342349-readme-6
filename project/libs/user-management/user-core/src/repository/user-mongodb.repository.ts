import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoRepository } from '@project/data-access';
import { Model } from 'mongoose';
import { UserEntity } from '../entity/user.entity';
import { UserFactory } from '../entity/user.factory';
import { UserModel } from '../entity/user.model';
import { UserRepository } from './user.repository.inteface';

@Injectable()
export class UserMongodbRepository extends BaseMongoRepository<UserEntity, UserModel> implements UserRepository {
  constructor(
    entityFactory: UserFactory,
    @InjectModel(UserModel.name) userModel: Model<UserModel>
  ) {
    super(entityFactory, userModel);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const foundDocument = await this.model.findOne({ email: email });
    return this.createEntityFromDocument(foundDocument);
  }

  public async containsSubscription(userId: string, subscriptionId: string): Promise<boolean> {
    const user = await this.model.findById(userId);
    if (!user) {
      return false;
    }

    return user.subscriptionIds.some(id => id.equals(subscriptionId));
  }

  public async addSubscription(userId: string, subscriptionId: string): Promise<UserEntity> {
    const updatedUser = await this.model.findByIdAndUpdate(userId,
      {
        $addToSet: { subscriptionIds: subscriptionId }
      },
      { new: true });

    return this.createEntityFromDocument(updatedUser);
  }

  public async removeSubscription(userId: string, subscriptionId: string): Promise<UserEntity> {
    const updatedUser = await this.model.findByIdAndUpdate(userId,
      {
        $pull: { subscriptionIds: subscriptionId }
      },
      { new: true });

    return this.createEntityFromDocument(updatedUser);
  }
}

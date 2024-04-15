import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserFactory } from './entity/user.factory';
import { UserModel, UserSchema } from './entity/user.model';
import { UserMongodbRepository } from './repository/user-mongodb.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])
  ],
  providers: [
    {
      provide: 'UserRepository',
      useFactory: (userFactory: UserFactory, userModel: Model<UserModel>) => new UserMongodbRepository(userFactory, userModel),
      inject: [UserFactory, getModelToken(UserModel.name)]
    },
    UserFactory
  ],
  exports: ['UserRepository']
})

export class UserCoreModule {
}

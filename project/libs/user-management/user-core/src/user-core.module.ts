import { Module } from '@nestjs/common';
import { UserFactory } from './entity/user.factory';
import { UserMemoryRepository } from './repository/user-memory.repository';

@Module({
  providers: [
    {
      provide: 'UserRepository',
      useFactory: () => new UserMemoryRepository(new UserFactory()),
    },
    UserFactory,
  ],
  exports: ['UserRepository', UserFactory],
})
export class UserCoreModule {}

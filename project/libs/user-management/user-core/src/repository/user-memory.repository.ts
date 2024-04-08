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
}

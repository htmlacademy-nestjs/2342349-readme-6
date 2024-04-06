import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';
import { UpdateUserDto } from '@project/user';
import { UserEntity } from '../entity/user.entity';
import { UserFactory } from '../entity/user.factory';
import { UserRepository } from './user.repository.inteface';

@Injectable()
export class UserMemoryRepository extends BaseMemoryRepository<UserEntity> implements UserRepository {
  constructor(entityFactory: UserFactory) {
    super(entityFactory);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const entities = Array.from(this.entities.values());
    const user = entities.find((entity) => entity.email === email);

    if (!user) {
      return Promise.resolve(null);
    }

    return Promise.resolve(this.entityFactory.create(user));
  }

  public async update(userId: string, entity: UpdateUserDto): Promise<UserEntity> {
    const currentUserEntity = this.entities.get(userId);
    Object.entries(entity).forEach(([key, value]) => {
      (currentUserEntity)[key] = value;
    });

    this.entities.set(userId, currentUserEntity);

    return Promise.resolve(this.entityFactory.create(currentUserEntity));
  }
}

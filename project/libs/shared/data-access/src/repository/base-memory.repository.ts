import { Entity, EntityFactory, StorableEntity } from '@project/shared-core';
import * as crypto from 'crypto';
import { Repository } from './repository.interface';

export abstract class BaseMemoryRepository<T extends Entity & StorableEntity<ReturnType<T['toPOJO']>>> implements Repository<T> {
  protected entities: Map<T['id'], ReturnType<T['toPOJO']>> = new Map();

  protected constructor(
    protected entityFactory: EntityFactory<T>
  ) {}

  public async findById(id: T['id']): Promise<T> {
    const foundEntity = this.entities.get(id) || null;
    if (!foundEntity) {
      return null;
    }

    return this.entityFactory.create(foundEntity);
  }

  public async save(entity: T): Promise<void> {
    if (!entity.id) {
      entity.id = crypto.randomUUID();
    }

    this.entities.set(entity.id, entity.toPOJO());
  }

  // public async update(entity: T): Promise<void> {
  //   if (!this.entities.has(entity.id)) {
  //     throw new Error('Entity not found');
  //   }
  //
  //   this.entities.set(entity.id, entity.toPOJO());
  // }

  public async deleteById(id: T['id']): Promise<void> {
    if (!this.entities.has(id)) {
      throw new Error('Entity not found');
    }

    this.entities.delete(id);
  }
}
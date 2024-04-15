import { NotFoundException } from '@nestjs/common';
import { Entity, EntityFactory, StorableEntity } from '@project/shared-core';
import { ObjectId } from 'mongodb';
import { Document, Model } from 'mongoose';
import { Repository } from './repository.interface';

export abstract class BaseMongoRepository<
  T extends Entity & StorableEntity<ReturnType<T['toPOJO']>>,
  DocumentType extends Document
> implements Repository<T> {

  protected constructor(
    protected entityFactory: EntityFactory<T>,
    protected readonly model: Model<DocumentType>
  ) {
  }

  protected createEntityFromDocument(entityDocument: DocumentType): T | null {
    if (!entityDocument) {
      return null;
    }

    const plainObject = entityDocument.toObject({ versionKey: false }) as ReturnType<T['toPOJO']>;

    return this.entityFactory.create(plainObject);
  }

  public async findById(id: T['id']): Promise<T> {
    const foundDocument = await this.model.findById(new ObjectId(id));

    return this.createEntityFromDocument(foundDocument);
  }

  public async save(entity: T): Promise<T> {
    const newEntity = new this.model(entity.toPOJO());
    const savedEntity = await newEntity.save();
    newEntity.id = savedEntity.id;

    return this.createEntityFromDocument(newEntity);
  }

  public async update(id: T['id'], entity: T): Promise<T> {
    const updatedDocument = await this.model
      .findByIdAndUpdate(new ObjectId(id), entity.toPOJO(), { new: true });
    if (!updatedDocument) {
      throw new NotFoundException(`Entity with id ${entity.id} not found`);
    }

    return this.createEntityFromDocument(updatedDocument);
  }

  public async deleteById(id: T['id']): Promise<T> {
    const deletedDocument = await this.model.findByIdAndDelete(new ObjectId(id));
    if (!deletedDocument) {
      throw new NotFoundException(`Entity with id ${id} not found.`);
    }

    return this.createEntityFromDocument(deletedDocument);
  }

  public async exists(id: T['id']): Promise<boolean> {
    // @ts-ignore
    const result = await this.model.exists({ _id: id });
    return !!result;
  }
}

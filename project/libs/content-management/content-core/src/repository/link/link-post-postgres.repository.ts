import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, PostStatus, PostType } from '@project/shared-core';
import { LinkPostEntity } from '../../entity/link/link-post.entity';
import { PostPostgresRepository } from '../post/post-postgres.repository';
import { LinkPostRepository } from './link-post.repository.inteface';

type PostWithDetails = Prisma.PostGetPayload<{
  include: { linkDetails: true };
}>;

@Injectable()
export class LinkPostPostgresRepository extends PostPostgresRepository<LinkPostEntity> implements LinkPostRepository {
  constructor(
    entityFactory: EntityFactory<LinkPostEntity>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private formatPostForPrisma(linkPostEntity: LinkPostEntity) {
    return {
      ...linkPostEntity,
      _id: undefined,
      id: undefined,
      url: undefined,
      description: undefined,
    };
  }

  private reformatLinkPostFromPrisma(createdLinkPost: PostWithDetails | null): LinkPostEntity {
    if (!createdLinkPost) {
      return null;
    }

    const linkPostEntityData = {
      ...createdLinkPost,
      postStatus: createdLinkPost.postStatus as PostStatus,
      postType: createdLinkPost.postType as PostType,
      url: createdLinkPost.linkDetails?.url,
      description: createdLinkPost.linkDetails?.description
    };

    return this.createEntityFromDocument(linkPostEntityData);
  }

  public async save(linkPostEntity: LinkPostEntity): Promise<LinkPostEntity> {
    const linkPostData = this.formatPostForPrisma(linkPostEntity);

    const createdLinkPost = await this.client.post.create({
      data: {
        ...linkPostData,
        linkDetails: {
          create: {
            url: linkPostEntity.url,
            description: linkPostEntity.description
          }
        }
      },
      include: { linkDetails: true }
    });

    return this.reformatLinkPostFromPrisma(createdLinkPost);
  }

  public async update(postId: LinkPostEntity['id'], linkPostEntity: LinkPostEntity): Promise<LinkPostEntity> {
    const linkPostData = this.formatPostForPrisma(linkPostEntity);

    const updatedLinkPost = await this.client.post.update({
      where: { id: postId },
      data: {
        ...linkPostData,
        linkDetails: {
          update: {
            url: linkPostEntity.url,
            description: linkPostEntity.description
          }
        }
      },
      include: { linkDetails: true }
    });

    return this.reformatLinkPostFromPrisma(updatedLinkPost);
  }

  public async findById(postId: LinkPostEntity['id']): Promise<LinkPostEntity | null> {
    const linkPostData = await this.client.post.findUnique({
      where: { id: postId },
      include: { linkDetails: true }
    });

    return this.reformatLinkPostFromPrisma(linkPostData);
  }

  public async deleteById(id: LinkPostEntity['id']): Promise<LinkPostEntity> {
    const deletedPost = await this.client.post.delete({
      where: { id },
      include: { linkDetails: true }
    });

    return this.reformatLinkPostFromPrisma(deletedPost);
  }

  public async exists(linkPostId: LinkPostEntity['id']): Promise<boolean> {
    const linkPost = await this.client.linkPost.findUnique({
      where: { id: linkPostId },
      select: { id: true }
    });

    return linkPost !== null;
  }
}

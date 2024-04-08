import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LinkPostEntity, LinkPostRepository } from '@project/content-core';
import { PostType } from '@project/shared-core';
import { CreateLinkPostDto } from './dto/create-link-post.dto';
import { UpdateLinkPostDto } from './dto/update-link-post.dto';
import {
  LINK_POST_DELETE_PERMISSION,
  LINK_POST_MODIFY_PERMISSION,
  LINK_POST_NOT_FOUND,
  LINK_POST_REPOST_AUTHOR,
  LINK_POST_REPOST_EXISTS
} from './link-post.constant';


@Injectable()
export class LinkPostService {
  constructor(
    @Inject('LinkPostRepository') private readonly linkPostRepository: LinkPostRepository,
  ) {}

  public async createPost(userId: string, dto: CreateLinkPostDto, originalPostId?: string): Promise<LinkPostEntity> {
    const linkPostData = {
      author: userId,
      postType: PostType.LINK,
      url: dto.url,
      description: dto.description,
      tags: dto.tags ?? [],
      originalPost: originalPostId ?? '',
    };

    const linkPostEntity = new LinkPostEntity(linkPostData);
    await this.linkPostRepository.save(linkPostEntity);

    return linkPostEntity;
  }

  public async findPostById(postId: string): Promise<LinkPostEntity> {
    const foundLinkPost = await this.linkPostRepository.findById(postId);
    if (!foundLinkPost) {
      throw new NotFoundException(LINK_POST_NOT_FOUND);
    }

    return foundLinkPost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.linkPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateLinkPostDto): Promise<LinkPostEntity> {
    const updatedLinkPost = await this.findPostById(postId);
    if (updatedLinkPost.authorId !== userId) {
      throw new UnauthorizedException(LINK_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedLinkPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedLinkPost.postStatus = dto.postStatus;
    if (dto.url !== undefined) updatedLinkPost.url = dto.url;
    if (dto.description !== undefined) updatedLinkPost.description = dto.description;

    return await this.linkPostRepository.update(postId, updatedLinkPost);
  }

  public async deletePostById(userId: string, postId: string): Promise<LinkPostEntity> {
    const deletedLinkPost = await this.findPostById(postId);
    if (deletedLinkPost.authorId !== userId) {
      throw new UnauthorizedException(LINK_POST_DELETE_PERMISSION);
    }

    await this.linkPostRepository.deleteById(postId);

    return deletedLinkPost;
  }

  public async repostPostById(userId: string, postId: string): Promise<LinkPostEntity> {
    const repostLinkPost = await this.findPostById(postId);
    if (repostLinkPost.authorId === userId) {
      throw new UnauthorizedException(LINK_POST_REPOST_AUTHOR);
    }

    //todo проверка что был уже репост
    if (false) {
      throw new ConflictException(LINK_POST_REPOST_EXISTS);
    }

    const createLinkPostDto: CreateLinkPostDto = {
      tags: repostLinkPost.tags,
      url: repostLinkPost.url,
      description: repostLinkPost.description,
    }

    return await this.createPost(userId, createLinkPostDto, repostLinkPost.id);
  }
}

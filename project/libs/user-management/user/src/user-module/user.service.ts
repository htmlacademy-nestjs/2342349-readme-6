import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AuthenticationService } from '@project/authentication';
import { ApplicationConfig } from '@project/user-config';
import { UserEntity, UserRepository } from '@project/user-core';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  SUBSCRIBE_USER_ALREADY_ADDED,
  SUBSCRIBE_USER_ALREADY_REMOVED,
  SUBSCRIBE_USER_NOT_FOUND, SUBSCRIBE_USER_YOURSELF,
  USER_EXISTS,
  USER_NOT_FOUND
} from './user.constant';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const existUser = await this.userRepository.findByEmail(dto.email);
    if (existUser) {
      throw new ConflictException(USER_EXISTS);
    }

    const hashedPassword = await this.authenticationService.hashPassword(dto.password);
    const userData = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      avatarId: dto.avatarId ?? this.applicationConfig.userDefaultAvatar,
      passwordHash: hashedPassword
    };

    const userEntity = new UserEntity(userData);
    return this.userRepository.save(userEntity);
  }

  public async findUserById(userId: string): Promise<UserEntity> {
    const foundUser = await this.userRepository.findById(userId);
    if (!foundUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return foundUser;
  }

  public async exists(userId: string): Promise<boolean> {
    return this.userRepository.exists(userId);
  }

  public async updateUserById(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
    const updatedUser = await this.findUserById(userId);

    if (dto.firstName !== undefined) updatedUser.firstName = dto.firstName;
    if (dto.dateOfBirth !== undefined) updatedUser.dateOfBirth = dto.dateOfBirth;
    if (dto.lastName !== undefined) updatedUser.lastName = dto.lastName;
    if (dto.avatarId !== undefined) updatedUser.avatarId = dto.avatarId;

    return this.userRepository.update(userId, updatedUser);
  }

  public async subscribeUserById(userId: string, subscribeUserId: string): Promise<UserEntity> {
    if (!await this.exists(userId)) {
      throw new NotFoundException(SUBSCRIBE_USER_NOT_FOUND);
    }

    if (await this.userRepository.containsSubscription(userId, subscribeUserId)) {
      throw new ConflictException(SUBSCRIBE_USER_ALREADY_ADDED);
    }

    //todo myself subscribe
    if (userId === subscribeUserId) {
      throw new BadRequestException(SUBSCRIBE_USER_YOURSELF);
    }

    const userEntityUpdated = await this.userRepository.addSubscription(userId, subscribeUserId);
    await this.incrementFollowerCount(subscribeUserId);

    return userEntityUpdated;
  }

  public async unsubscribeUserById(userId: string, unsubscribeUserId: string): Promise<UserEntity> {
    if (!await this.exists(userId)) {
      throw new NotFoundException(SUBSCRIBE_USER_NOT_FOUND);
    }

    if (!await this.userRepository.containsSubscription(userId, unsubscribeUserId)) {
      throw new ConflictException(SUBSCRIBE_USER_ALREADY_REMOVED);
    }

    const userEntityUpdated = await this.userRepository.removeSubscription(userId, unsubscribeUserId);
    await this.decrementFollowerCount(unsubscribeUserId);

    return userEntityUpdated;
  }

  public async incrementFollowerCount(userId: string): Promise<boolean> {
    const isFollowerCountUpdated = await this.userRepository.incrementFollowerCount(userId);
    if (!isFollowerCountUpdated) {
      this.logger.error(`Failed to increment 'followerCount' for User ID '${userId}'`);
    }

    return isFollowerCountUpdated;
  }

  public async decrementFollowerCount(userId: string): Promise<boolean> {
    const isFollowerCountUpdated = await this.userRepository.decrementFollowerCount(userId);
    if (!isFollowerCountUpdated) {
      this.logger.error(`Failed to decrement 'followerCount' for User ID '${userId}'`);
    }

    return isFollowerCountUpdated;
  }

  //todo incrementPostCount
  public async incrementPostCount(userId: string): Promise<boolean> {
    const isPostCountUpdated = await this.userRepository.incrementPostCount(userId);
    if (!isPostCountUpdated) {
      this.logger.error(`Failed to increment 'PostCount' for User ID '${userId}'`);
    }

    return isPostCountUpdated;
  }

  //todo decrementPostCount
  public async decrementPostCount(userId: string): Promise<boolean> {
    const isPostCountUpdated = await this.userRepository.decrementPostCount(userId);
    if (!isPostCountUpdated) {
      this.logger.error(`Failed to decrement 'PostCount' for User ID '${userId}'`);
    }

    return isPostCountUpdated;
  }
}

import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AuthenticationService } from '@project/authentication';
import { ApplicationConfig, DbConfig } from '@project/user-config';
import { UserEntity, UserRepository } from '@project/user-core';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  SUBSCRIBE_USER_ALREADY_ADDED,
  SUBSCRIBE_USER_ALREADY_REMOVED,
  SUBSCRIBE_USER_NOT_FOUND,
  USER_EXISTS,
  USER_NOT_FOUND
} from './user.constant';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
    @Inject(DbConfig.KEY) private readonly databaseConfig: ConfigType<typeof DbConfig>,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>,
  ) {}

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
      passwordHash: hashedPassword,
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

    return await this.userRepository.update(userId, updatedUser);
  }

  public async subscribeUserById(userId: string, subscribeUserId: string): Promise<UserEntity> {
    if (!await this.exists(userId)) {
      throw new NotFoundException(SUBSCRIBE_USER_NOT_FOUND);
    }

    if (await this.userRepository.containsSubscription(userId, subscribeUserId)) {
      throw new ConflictException(SUBSCRIBE_USER_ALREADY_ADDED);
    }

    return await this.userRepository.addSubscription(userId, subscribeUserId);
  }

  public async unsubscribeUserById(userId: string, unsubscribeUserId: string): Promise<UserEntity>  {
    if (!await this.exists(userId)) {
      throw new NotFoundException(SUBSCRIBE_USER_NOT_FOUND);
    }

    if (!await this.userRepository.containsSubscription(userId, unsubscribeUserId)) {
      throw new ConflictException(SUBSCRIBE_USER_ALREADY_REMOVED);
    }

    return await this.userRepository.removeSubscription(userId, unsubscribeUserId);
  }
}

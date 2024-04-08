import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticationService } from '@project/authentication';
import { UserEntity, UserRepository } from '@project/user-core';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SUBSCRIBE_USER_NOT_FOUND, USER_EXISTS, USER_NOT_FOUND } from './user.constant';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
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
      avatarId: dto?.avatarUrl,
      passwordHash: hashedPassword,
    };

    const userEntity = new UserEntity(userData);
    await this.userRepository.save(userEntity);

    return userEntity;
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
    if (dto.avatarUrl !== undefined) updatedUser.avatarId = dto.avatarUrl;

    return await this.userRepository.update(userId, updatedUser);
  }

  public async subscribeUserById(userId: string, subscribeUserId: string): Promise<UserEntity> {
    const currentUser = await this.findUserById(userId);

    const subscribeUser = await this.userRepository.findById(subscribeUserId);
    if (!subscribeUser) {
      throw new NotFoundException(SUBSCRIBE_USER_NOT_FOUND);
    }

    if (currentUser.subscriptionIds.includes(subscribeUser.id)) {
      return currentUser;
    }

    currentUser.subscriptionIds.push(subscribeUser.id);
    return await this.userRepository.update(userId, currentUser);
  }

  public async unsubscribeUserById(userId: string, unsubscribeUserId: string): Promise<UserEntity>  {
    const currentUser = await this.findUserById(userId);

    const subscribeUser = await this.userRepository.findById(unsubscribeUserId);
    if (!subscribeUser) {
      throw new NotFoundException(SUBSCRIBE_USER_NOT_FOUND);
    }

    if (!currentUser.subscriptionIds.includes(subscribeUser.id)) {
      return currentUser;
    }

    currentUser.subscriptionIds = currentUser.subscriptionIds.filter(subscriptionId => subscriptionId !== unsubscribeUserId);

    return await this.userRepository.update(userId, currentUser);
  }
}

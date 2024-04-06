import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticationService } from '@project/authentication';
import { UserEntity, UserRepository } from '@project/user-core';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_EXISTS, USER_NOT_FOUND } from './user.constant';

@Injectable()
export class UserService implements UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public async create(dto: CreateUserDto): Promise<UserEntity> {
    const existUser = await this.userRepository.findByEmail(dto.email);
    if (existUser) {
      throw new ConflictException(USER_EXISTS);
    }

    const hashedPassword = await this.authenticationService.hashPassword(dto.password);
    const userData = {
      email: dto.email,
      firstname: dto.firstname,
      lastname: dto.lastname,
      avatarId: dto?.avatarId,
      passwordHash: hashedPassword,
    };

    const userEntity = new UserEntity(userData);
    await this.userRepository.save(userEntity);
    userEntity.emptyPasswordHash();

    return userEntity;
  }

  public async update(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
    const existUser = await this.userRepository.findById(userId);
    if (existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const userData = {
      firstname: dto?.firstname,
      dateOfBirth: dto?.dateOfBirth,
      lastname: dto?.lastname,
      avatarId: dto?.avatarId,
    };

    return await this.userRepository.update(userId, userData);
  }
}

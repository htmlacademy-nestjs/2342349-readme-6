import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CryptoProtocol } from '@project/shared-helpers';
import { UserRepository } from '@project/user-core';
import { AUTHENTICATION_PASSWORD_EMPTY } from './authentication.constant';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('CryptoProtocol') private readonly cryptoProtocol: CryptoProtocol
  ) {}

  // public async register(dto: CreateUserDto): Promise<UserEntity> {
  //   const {email, firstname, lastname, password, dateBirth} = dto;
  //
  //   const blogUser = {
  //     email: email,
  //     firstname: firstname,
  //     lastname: lastname,
  //     role: UserType.USER,
  //     avatar: '',
  //     dateOfBirth: dayjs(dateBirth).toDate(),
  //     passwordHash: ''
  //   };
  //
  //   const existUser = await this.userRepository.findByEmail(email);
  //   if (existUser) {
  //     throw new ConflictException(AUTH_USER_EXISTS);
  //   }
  //
  //   const userEntity = new UserEntity(blogUser);
  //   const passwordHash = await this.hashPassword(password);
  //   userEntity.setPassword(passwordHash);
  //
  //   await this.userRepository.save(userEntity);
  //   existUser.passwordHash = '';
  //   return userEntity;
  // }

  public async hashPassword(password: string) {
    if (!password) {
      throw new BadRequestException(AUTHENTICATION_PASSWORD_EMPTY);
    }

    return await this.cryptoProtocol.hashPassword(password);
  }

  // public async verifyUser(dto: LoginDto): Promise<UserEntity> {
  //   const {email, password} = dto;
  //
  //   const existUser = await this.userRepository.findByEmail(email);
  //   if (!existUser) {
  //     throw new NotFoundException(AUTH_USER_NOT_FOUND);
  //   }
  //
  //   if (!await this.cryptoProtocol.verifyPassword(existUser.passwordHash, password)) {
  //     throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
  //   }
  //
  //   existUser.passwordHash = '';
  //   return existUser;
  // }
  //
  // public async getUser(id: string): Promise<UserEntity> {
  //   return this.userRepository.findById(id);
  // }
}

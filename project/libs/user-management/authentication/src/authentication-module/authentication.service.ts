import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CryptoProtocol } from '@project/shared-helpers';
import { UserEntity, UserRepository } from '@project/user-core';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginDto } from '../dto/login.dto';
import {
  AUTHENTICATION_NEW_PASSWORD_SAME,
  AUTHENTICATION_PASSWORD_EMPTY,
  AUTHENTICATION_USER_NOT_FOUND,
  AUTHENTICATION_USER_PASSWORD_WRONG
} from './authentication.constant';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('CryptoProtocol') private readonly cryptoProtocol: CryptoProtocol
  ) {}

  public async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new BadRequestException(AUTHENTICATION_PASSWORD_EMPTY);
    }

    return await this.cryptoProtocol.hashPassword(password);
  }

  public async verifyUser(dto: LoginDto): Promise<UserEntity> {
    const {email, password} = dto;

    const existUser = await this.userRepository.findByEmail(email);
    if (!existUser) {
      throw new NotFoundException(AUTHENTICATION_USER_NOT_FOUND);
    }

    const isPasswordCorrect = await this.cryptoProtocol.verifyPassword(password, existUser.passwordHash);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException(AUTHENTICATION_USER_PASSWORD_WRONG);
    }

    return existUser;
  }


  public async changePassword(userId: string, dto: ChangePasswordDto): Promise<UserEntity> {
    const {oldPassword, newPassword} = dto;

    if (oldPassword === newPassword) {
      throw new NotFoundException(AUTHENTICATION_NEW_PASSWORD_SAME);
    }

    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) {
      throw new NotFoundException(AUTHENTICATION_USER_NOT_FOUND);
    }

    updatedUser.passwordHash = await this.hashPassword(newPassword);

    return await this.userRepository.update(userId, updatedUser);
  }
}

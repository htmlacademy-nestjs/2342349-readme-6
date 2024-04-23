import {
  BadRequestException,
  HttpException, HttpStatus,
  Inject,
  Injectable, Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenPayload, User } from '@project/shared-core';
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
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('CryptoProtocol') private readonly cryptoProtocol: CryptoProtocol,
    private readonly jwtService: JwtService,
  ) {}

  public async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new BadRequestException(AUTHENTICATION_PASSWORD_EMPTY);
    }

    return await this.cryptoProtocol.hashPassword(password);
  }

  public async verifyUser(dto: LoginDto): Promise<{ authenticatedUserToken: Token; existUser: UserEntity }> {
    const {email, password} = dto;

    const existUser = await this.userRepository.findByEmail(email);
    if (!existUser) {
      throw new NotFoundException(AUTHENTICATION_USER_NOT_FOUND);
    }

    const isPasswordCorrect = await this.cryptoProtocol.verifyPassword(password, existUser.passwordHash);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException(AUTHENTICATION_USER_PASSWORD_WRONG);
    }

    const authenticatedUserToken = await this.createUserToken(existUser);

    return {existUser, authenticatedUserToken};
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

    return this.userRepository.update(userId, updatedUser);
  }

  public async createUserToken(user: User): Promise<Token> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName
    };

    try {
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } catch (error) {
      this.logger.error('[Token generation error]: ' + error.message);
      throw new HttpException('Token generation error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

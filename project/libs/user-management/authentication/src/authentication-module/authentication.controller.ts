import { Body, Controller, HttpCode, HttpStatus, Logger, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Token } from '@project/shared-core';
import { fillDto } from '@project/shared-helpers';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtRefreshGuard } from '../guard/jwt-refresh.guard';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { LoggedRdo } from '../rdo/logged.rdo';
import { AuthenticationService } from './authentication.service';
import { RequestWithUser } from './request-with-user.interface';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(
    private readonly authService: AuthenticationService
  ) {
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: LoginDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User password is empty' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User password is wrong' })
  public async login(
    @Req() { user }: RequestWithUser
  ): Promise<LoggedRdo> {
    this.logger.log(`User logged in successfully: ${user.email}`);
    const userToken = await this.authService.createUserToken(user);

    return fillDto(LoggedRdo, { ...userToken, ...user.toPOJO() });
  }

  //todo JwtAuthGuard
  @Patch('change-password/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: ChangePasswordDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User password is the same' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  public async changePassword(
    @Param('userId') userId: string,
    @Body() dto: ChangePasswordDto
  ): Promise<LoggedRdo> {
    this.logger.log(`Changing password for user ID: '${userId}'`);
    //todo userId from token
    const updatedUser = await this.authService.changePassword(userId, dto);

    return fillDto(LoggedRdo, updatedUser.toPOJO());
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({ status: HttpStatus.OK, description: 'New access and refresh tokens provided' })
  public async refreshToken(
    @Req() { user }: RequestWithUser
  ): Promise<Token> {
    return this.authService.createUserToken(user);
  }
}


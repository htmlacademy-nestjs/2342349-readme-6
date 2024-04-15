import { Body, Controller, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginDto } from '../dto/login.dto';
import { LoggedRdo } from '../rdo/logged.rdo';
import { AuthenticationService } from './authentication.service';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: LoginDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User password is empty' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User password is wrong' })
  public async login(
    @Body() dto: LoginDto
  ): Promise<LoggedRdo> {
    const verifiedUser = await this.authService.verifyUser(dto);
    return fillDto(LoggedRdo, verifiedUser.toPOJO());
  }

  @Patch('change-password/:userId')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: ChangePasswordDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User password is the same' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiBearerAuth()
  public async changePassword(
    @Param('userId') userId: string,
    @Body() dto: ChangePasswordDto
  ): Promise<LoggedRdo> {
    //todo userId from token
    const updatedUser = await this.authService.changePassword(userId, dto);
    return fillDto(LoggedRdo, updatedUser.toPOJO());
  }
}


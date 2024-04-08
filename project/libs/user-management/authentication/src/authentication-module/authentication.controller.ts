import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { fillDto } from '@project/shared-helpers';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginDto } from '../dto/login.dto';
import { LoggedRdo } from '../rdo/logged.rdo';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService
  ) {}

  @Post('login')
  public async login(
    @Body() dto: LoginDto
  ): Promise<LoggedRdo> {
    const verifiedUser = await this.authService.verifyUser(dto);
    return fillDto(LoggedRdo, verifiedUser.toPOJO());
  }

  @Patch('change-password/:userId')
  public async changePassword(
    @Param('userId') userId: string,
    @Body() dto: ChangePasswordDto
  ): Promise<LoggedRdo> {
    //todo userId from token
    const updatedUser = await this.authService.changePassword(userId, dto);
    return fillDto(LoggedRdo, updatedUser.toPOJO());
  }
}


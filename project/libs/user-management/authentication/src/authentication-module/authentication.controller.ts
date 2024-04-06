import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService
  ) {}

  // @Post('register')
  // public async create(@Body() dto: CreateUserDto) {
  //   const newUser = await this.authService.register(dto);
  //   return fillDto(UserRdo, newUser.toPOJO());
  // }

  // @Get(':id')
  // public async show(@Param('id') id: string) {
  //   // const existUser = await this.authService.getUser(id);
  //   // return fillDto(UserRdo, existUser.toPOJO());
  // }

  @Post('login')
  public async login(
    @Body() dto: LoginDto
  ): Promise<void> {
    // const verifiedUser = await this.authService.verifyUser(dto);
    // return fillDto(LoggedRdo, verifiedUser.toPOJO());
  }

  @Patch('change-password')
  public async changePassword(
    @Body() dto: ChangePasswordDto
  ): Promise<void> {

  }
}


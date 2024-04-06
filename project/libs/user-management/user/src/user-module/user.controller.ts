import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { fillDto } from '@project/shared-helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRdo } from './rdo/user.rdo';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Post('')
  public async createUser(
    @Body() dto: CreateUserDto
  ): Promise<UserRdo> {
    const createdUser = await this.userService.create(dto);
    return fillDto(UserRdo, createdUser.toPOJO());
  }

  @Patch(':userId')
  public async updateUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto
  ): Promise<UserRdo> {
    //todo userId from token
    const updatedUser = await this.userService.update(userId, dto);
    return fillDto(UserRdo, updatedUser.toPOJO());
  }

  @Get(':userId')
  public async getUserById(
    @Param('userId') userId: string
  ): Promise<void> {

  }

  @Post('subscription/:userId')
  public async subscribeUser(
    @Param('userId') subscribeUserId: string
  ): Promise<void> {
  }


  @Delete('subscription/:userId')
  public async unsubscribeUser(
    @Param('userId') unsubscribeUserId: string
  ): Promise<void> {
  }




}

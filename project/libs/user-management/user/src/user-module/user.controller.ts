import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { fillDto } from '@project/shared-helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubscriptionRdo } from './rdo/subscription.rdo';
import { UserRdo } from './rdo/user.rdo';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('')
  public async createUser(
    @Body() dto: CreateUserDto
  ): Promise<UserRdo> {
    const createdUser = await this.userService.createUser(dto);
    return fillDto(UserRdo, createdUser.toPOJO());
  }

  @Get(':userId')
  public async getUser(
    @Param('userId') userId: string
  ): Promise<UserRdo> {
    const foundUser = await this.userService.findUserById(userId);
    return fillDto(UserRdo, foundUser.toPOJO());
  }

  @Patch(':userId')
  public async updateUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto
  ): Promise<UserRdo> {
    //todo userId from token
    const updatedUser = await this.userService.updateUserById(userId, dto);
    return fillDto(UserRdo, updatedUser.toPOJO());
  }

  @Post('subscription/:userId')
  public async subscribeUser(
    @Param('userId') subscribeUserId: string
  ): Promise<SubscriptionRdo> {
    //todo userId from token
    const updatedUser = await this.userService.subscribeUserById(subscribeUserId, subscribeUserId);
    return fillDto(SubscriptionRdo, updatedUser.toPOJO());
  }

  @Delete('subscription/:userId')
  public async unsubscribeUser(
    @Param('userId') unsubscribeUserId: string
  ): Promise<SubscriptionRdo> {
    //todo userId from token
    const updatedUser = await this.userService.unsubscribeUserById(unsubscribeUserId, unsubscribeUserId);
    return fillDto(SubscriptionRdo, updatedUser.toPOJO());
  }
}

import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { fillDto } from '@project/shared-helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubscriptionRdo } from './rdo/subscription.rdo';
import { UserRdo } from './rdo/user.rdo';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created', type: UserRdo })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User exists' })
  public async createUser(
    @Body() dto: CreateUserDto
  ): Promise<UserRdo> {
    const createdUser = await this.userService.createUser(dto);
    return fillDto(UserRdo, createdUser.toPOJO());
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found', type: UserRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiBearerAuth()
  public async getUser(
    @Param('userId') userId: string
  ): Promise<UserRdo> {
    const foundUser = await this.userService.findUserById(userId);
    return fillDto(UserRdo, foundUser.toPOJO());
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated', type: UserRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiBearerAuth()
  public async updateUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto
  ): Promise<UserRdo> {
    //todo userId from token
    const updatedUser = await this.userService.updateUserById(userId, dto);
    return fillDto(UserRdo, updatedUser.toPOJO());
  }

  @Post('subscription/:userId')
  @ApiOperation({ summary: 'Subscribe user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User subscribed', type: SubscriptionRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  @ApiBearerAuth()
  public async subscribeUser(
    @Param('userId') subscribeUserId: string
  ): Promise<SubscriptionRdo> {
    //todo userId from token
    const updatedUser = await this.userService.subscribeUserById(subscribeUserId, subscribeUserId);

    console.log('updatedUser');
    console.log(updatedUser);
    return fillDto(SubscriptionRdo, updatedUser.toPOJO());
  }

  @Delete('subscription/:userId')
  @ApiOperation({ summary: 'Unsubscribe user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User unsubscribed', type: SubscriptionRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  @ApiBearerAuth()
  public async unsubscribeUser(
    @Param('userId') unsubscribeUserId: string
  ): Promise<SubscriptionRdo> {
    //todo userId from token
    const updatedUser = await this.userService.unsubscribeUserById(unsubscribeUserId, unsubscribeUserId);
    return fillDto(SubscriptionRdo, updatedUser.toPOJO());
  }
}

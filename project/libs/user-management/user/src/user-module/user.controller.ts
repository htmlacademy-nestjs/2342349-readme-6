import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/shared-helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubscriptionRdo } from './rdo/subscription.rdo';
import { UserRdo } from './rdo/user.rdo';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

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
    this.logger.log(`Creating new user with email: ${dto.email}`);
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
    @Param('userId', MongoIdValidationPipe) userId: string
  ): Promise<UserRdo> {
    this.logger.log(`Retrieving user with ID: ${userId}`);
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
    this.logger.log(`Updating user with ID: ${userId}`);
    //todo userId from token
    const updatedUser = await this.userService.updateUserById(userId, dto);

    return fillDto(UserRdo, updatedUser.toPOJO());
  }

  @Post('subscription/:subscribeUserId/:userId')
  @ApiOperation({ summary: 'Subscribe user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User subscribed', type: SubscriptionRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  @ApiBearerAuth()
  public async subscribeUser(
    @Param('userId', MongoIdValidationPipe) userId: string,
    @Param('subscribeUserId', MongoIdValidationPipe) subscribeUserId: string
  ): Promise<SubscriptionRdo> {
    this.logger.log(`Subscribing user ${userId} to user ${subscribeUserId}`);
    //todo userId from token
    const updatedUser = await this.userService.subscribeUserById(userId, subscribeUserId);

    return fillDto(SubscriptionRdo, updatedUser.toPOJO());
  }

  @Delete('subscription/:unsubscribeUserId/:userId')
  @ApiOperation({ summary: 'Unsubscribe user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User unsubscribed', type: SubscriptionRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  @ApiBearerAuth()
  public async unsubscribeUser(
    @Param('userId', MongoIdValidationPipe) userId: string,
    @Param('unsubscribeUserId', MongoIdValidationPipe) unsubscribeUserId: string
  ): Promise<SubscriptionRdo> {
    this.logger.log(`Unsubscribing user ${userId} from user ${unsubscribeUserId}`);
    //todo userId from token
    const updatedUser = await this.userService.unsubscribeUserById(userId, unsubscribeUserId);

    return fillDto(SubscriptionRdo, updatedUser.toPOJO());
  }
}

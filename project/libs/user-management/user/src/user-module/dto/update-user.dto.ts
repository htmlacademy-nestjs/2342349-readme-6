import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John',
    required: false,
  })
  public firstName?: string;

  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe',
    required: false,
  })
  public lastName?: string;

  @ApiProperty({
    description: 'The date of birth of the user.',
    type: 'string',
    format: 'date',
    required: false,
  })
  public dateOfBirth?: Date;

  @ApiProperty({
    description: 'The URL to the user\'s avatar image.',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  public avatarId?: string;
}

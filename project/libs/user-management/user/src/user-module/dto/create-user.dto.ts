import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique user email address.',
    example: 'user@example.com',
  })
  public email: string;

  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John',
  })
  public firstName: string;

  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe',
  })
  public lastName: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'YourSecurePassword123!',
  })
  public password: string;

  @ApiProperty({
    description: 'The URL to the user\'s avatar image.',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  public avatarUrl?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique user email address.',
    example: 'user@example.com',
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John',
  })
  @IsString()
  public firstName: string;

  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe',
  })
  @IsString()
  public lastName: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'YourSecurePassword123!',
  })
  @IsString()
  public password: string;

  @ApiProperty({
    description: 'The URL to the user\'s avatar image.',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public avatarId?: string;
}

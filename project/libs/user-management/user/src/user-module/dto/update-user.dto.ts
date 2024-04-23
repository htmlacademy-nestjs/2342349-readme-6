import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  public firstName?: string;

  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  public lastName?: string;

  @ApiProperty({
    description: 'The date of birth of the user.',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  public dateOfBirth?: Date;

  @ApiProperty({
    description: 'The URL to the user\'s avatar image.',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public avatarId?: string;
}

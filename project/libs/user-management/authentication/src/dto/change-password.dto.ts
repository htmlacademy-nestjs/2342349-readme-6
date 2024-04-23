import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The user\'s current password.',
    example: 'CurrentPassword123!',
  })
  @IsString()
  public oldPassword: string;

  @ApiProperty({
    description: 'The new password that the user wants to set.',
    example: 'NewSecurePassword321!',
  })
  @IsString()
  public newPassword: string;
}

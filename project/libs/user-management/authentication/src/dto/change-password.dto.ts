import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The user\'s current password.',
    example: 'CurrentPassword123!',
  })
  public oldPassword: string;

  @ApiProperty({
    description: 'The new password that the user wants to set.',
    example: 'NewSecurePassword321!',
  })
  public newPassword: string;
}

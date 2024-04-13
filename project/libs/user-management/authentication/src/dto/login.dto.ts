import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user trying to log in.',
    example: 'user@example.com',
  })
  public email: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'UserPassword123!',
  })
  public password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoggedRdo {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the user.',
    example: '123',
  })
  public id: string;

  @Expose()
  @ApiProperty({
    description: 'The email address of the logged-in user.',
    example: 'user@example.com',
  })
  public email: string;

  @Expose()
  @ApiProperty({
    description: 'The access token generated for the session.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  public accessToken: string;
}

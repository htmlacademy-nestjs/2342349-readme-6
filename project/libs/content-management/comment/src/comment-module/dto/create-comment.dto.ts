import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The text content of the comment.',
    example: 'This is a comment.',
  })
  @IsString()
  public text: string;
}

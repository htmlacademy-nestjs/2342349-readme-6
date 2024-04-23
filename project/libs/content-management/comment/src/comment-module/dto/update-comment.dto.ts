import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'The updated text content of the comment.',
    example: 'This is an updated comment.',
  })
  @IsString()
  public text: string;
}

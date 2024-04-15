import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The text content of the comment.',
    example: 'This is a comment.',
  })
  public text: string;
}

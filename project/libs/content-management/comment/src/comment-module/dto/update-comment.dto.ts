import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'The updated text content of the comment.',
    example: 'This is an updated comment.',
  })
  public text: string;
}

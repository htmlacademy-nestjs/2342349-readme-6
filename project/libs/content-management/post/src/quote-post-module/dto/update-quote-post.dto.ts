import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@project/shared-core';

export class UpdateQuotePostDto {
  @ApiProperty({
    description: 'Updated tags for the quote post.',
    example: ['inspiration', 'music']
  })
  public tags: string[];

  @ApiProperty({
    description: 'The current status of the post.',
    enum: PostStatus
  })
  public postStatus: PostStatus;

  @ApiProperty({
    description: 'The updated text of the quote, if changing.',
    example: 'Life is what happens to you while you’re busy making other plans.',
    required: false
  })
  public text?: string;

  @ApiProperty({
    description: 'The updated author of the quote, if changing.',
    example: 'John Lennon',
    required: false
  })
  public quoteAuthorId?: string;
}

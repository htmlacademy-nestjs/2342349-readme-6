import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostRdo } from '../../post-module/rdo/post.rdo';

export class QuotePostRdo extends PostRdo {
  @Expose()
  @ApiProperty({
    description: 'The text of the quote.',
    example: 'Life is what happens when you’re busy making other plans.'
  })
  public text: string;

  @Expose()
  @ApiProperty({
    description: 'The author of the quote.',
    example: 'John Lennon'
  })
  public quoteAuthor: string;
}

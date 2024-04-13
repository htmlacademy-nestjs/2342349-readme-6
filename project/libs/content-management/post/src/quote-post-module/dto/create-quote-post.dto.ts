import { ApiProperty } from '@nestjs/swagger';

export class CreateQuotePostDto {
  @ApiProperty({
    description: 'The main text of the quote post.',
    example: 'Life is what happens when you’re busy making other plans.'
  })
  public text: string;

  @ApiProperty({
    description: 'The author of the quote.',
    example: 'John Lennon'
  })
  public quoteAuthor: string;

  @ApiProperty({
    description: 'Tags associated with the quote post.',
    example: ['life', 'plans'],
    required: false
  })
  public tags?: string[];
}

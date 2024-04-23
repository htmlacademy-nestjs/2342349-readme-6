import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateQuotePostDto {
  @ApiProperty({
    description: 'The main text of the quote post.',
    example: 'Life is what happens when you’re busy making other plans.'
  })
  @IsString()
  public text: string;

  @ApiProperty({
    description: 'The author of the quote.',
    example: 'John Lennon'
  })
  @IsString()
  public quoteAuthorId: string;

  @ApiProperty({
    description: 'Tags associated with the quote post.',
    example: ['life', 'plans'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public tags?: string[];
}

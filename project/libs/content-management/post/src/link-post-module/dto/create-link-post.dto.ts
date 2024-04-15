import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkPostDto {
  @ApiProperty({
    description: 'The URL of the link post.',
    example: 'https://example.com/article'
  })
  public url: string;

  @ApiProperty({
    description: 'A short description of the link post.',
    example: 'This is an interesting article about technology.'
  })
  public description: string;

  @ApiProperty({
    description: 'Tags associated with the post.',
    example: ['tech', 'news'],
    required: false
  })
  public tags?: string[];
}

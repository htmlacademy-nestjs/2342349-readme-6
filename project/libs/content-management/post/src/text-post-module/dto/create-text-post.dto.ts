import { ApiProperty } from '@nestjs/swagger';

export class CreateTextPostDto {
  @ApiProperty({
    description: 'The title of the text post.',
    example: 'New Perspectives on Software Development'
  })
  public title: string;

  @ApiProperty({
    description: 'A brief announcement or summary of the text post.',
    example: 'Exploring innovative approaches to modern software practices.'
  })
  public announcement: string;

  @ApiProperty({
    description: 'The full text content of the post.',
    example: 'In this article, we delve into various methodologies...'
  })
  public text: string;

  @ApiProperty({
    description: 'Tags associated with the text post.',
    example: ['software', 'development'],
    required: false
  })
  public tags?: string[];
}

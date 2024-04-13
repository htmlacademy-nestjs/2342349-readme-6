import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoPostDto {
  @ApiProperty({
    description: 'The title of the video post.',
    example: 'Exploring the Grand Canyon'
  })
  public title: string;

  @ApiProperty({
    description: 'The URL where the video can be accessed.',
    example: 'https://example.com/video/grand-canyon'
  })
  public url: string;

  @ApiProperty({
    description: 'Tags associated with the video post.',
    example: ['adventure', 'travel'],
    required: false
  })
  public tags?: string[];
}

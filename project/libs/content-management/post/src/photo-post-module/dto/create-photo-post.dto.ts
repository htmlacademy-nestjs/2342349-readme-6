import { ApiProperty } from '@nestjs/swagger';

export class CreatePhotoPostDto {
  @ApiProperty({
    description: 'The URL of the photo.',
    example: 'https://example.com/photo.jpg'
  })
  public url: string;

  @ApiProperty({
    description: 'Tags associated with the photo post.',
    example: ['nature', 'photography'],
    required: false
  })
  public tags?: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@project/shared-core';

export class UpdatePhotoPostDto {
  @ApiProperty({
    description: 'Updated tags for the post.',
    example: ['travel', 'new']
  })
  public tags: string[];

  @ApiProperty({
    description: 'The current status of the post.',
    enum: PostStatus
  })
  public postStatus: PostStatus;

  @ApiProperty({
    description: 'The updated URL of the photo, if applicable.',
    example: 'https://example.com/newphoto.jpg',
    required: false
  })
  public url?: string;
}

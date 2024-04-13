import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@project/shared-core';

export class UpdateVideoPostDto {
  @ApiProperty({
    description: 'Updated tags for the video post.',
    example: ['nature', 'documentary']
  })
  public tags: string[];

  @ApiProperty({
    description: 'The current status of the post.',
    enum: PostStatus
  })
  public postStatus: PostStatus;

  @ApiProperty({
    description: 'The updated title of the video post, if applicable.',
    example: 'The Grand Canyon: A Closer Look',
    required: false
  })
  public title?: string;

  @ApiProperty({
    description: 'The updated URL of the video, if applicable.',
    example: 'https://example.com/video/grand-canyon-close',
    required: false
  })
  public url?: string;
}

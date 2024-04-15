import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@project/shared-core';

export class UpdateLinkPostDto {
  @ApiProperty({
    description: 'Tags to update in the post.',
    example: ['updatedTag']
  })
  public tags: string[];

  @ApiProperty({
    description: 'The current status of the post.',
    enum: PostStatus
  })
  public postStatus: PostStatus;

  @ApiProperty({
    description: 'The URL of the link post, if updating.',
    example: 'https://example.com/new-article',
    required: false
  })
  public url?: string;

  @ApiProperty({
    description: 'A new description for the post, if updating.',
    example: 'Updated description of the article.',
    required: false
  })
  public description?: string;
}

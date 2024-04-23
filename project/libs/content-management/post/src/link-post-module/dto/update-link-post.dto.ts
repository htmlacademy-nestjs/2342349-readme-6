import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@project/shared-core';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateLinkPostDto {
  @ApiProperty({
    description: 'Tags to update in the post.',
    example: ['updatedTag']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public tags?: string[];

  @ApiProperty({
    description: 'The current status of the post.',
    enum: PostStatus
  })
  @IsOptional()
  @IsEnum(PostStatus)
  public postStatus?: PostStatus;

  @ApiProperty({
    description: 'The URL of the link post, if updating.',
    example: 'https://example.com/new-article',
    required: false
  })
  @IsOptional()
  @IsUrl()
  public url?: string;

  @ApiProperty({
    description: 'A new description for the post, if updating.',
    example: 'Updated description of the article.',
    required: false
  })
  @IsOptional()
  @IsString()
  public description?: string;
}

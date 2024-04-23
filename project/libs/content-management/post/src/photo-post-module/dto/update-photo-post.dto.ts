import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@project/shared-core';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePhotoPostDto {
  @ApiProperty({
    description: 'Updated tags for the post.',
    example: ['travel', 'new']
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
    description: 'The updated URL of the photo, if applicable.',
    example: 'https://example.com/newphoto.jpg',
    required: false
  })
  @IsOptional()
  @IsUrl()
  public url?: string;
}

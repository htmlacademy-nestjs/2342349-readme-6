import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@project/shared-core';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTextPostDto {
  @ApiProperty({
    description: 'Updated tags for the text post.',
    example: ['tech', 'innovation']
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
    description: 'The updated title of the text post, if applicable.',
    example: 'Advanced Perspectives on Software Development',
    required: false
  })
  @IsOptional()
  @IsString()
  public title?: string;

  @ApiProperty({
    description: 'Updated announcement or summary of the text post, if applicable.',
    example: 'A deeper look into cutting-edge software practices.',
    required: false
  })
  @IsOptional()
  @IsString()
  public announcement?: string;

  @ApiProperty({
    description: 'Updated full text content of the post, if applicable.',
    example: 'This updated article continues to explore...',
    required: false
  })
  @IsOptional()
  @IsString()
  public text?: string;
}

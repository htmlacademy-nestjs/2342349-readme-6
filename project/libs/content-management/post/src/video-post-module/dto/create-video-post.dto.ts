import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateVideoPostDto {
  @ApiProperty({
    description: 'The title of the video post.',
    example: 'Exploring the Grand Canyon'
  })
  @IsString()
  public title: string;

  @ApiProperty({
    description: 'The URL where the video can be accessed.',
    example: 'https://example.com/video/grand-canyon'
  })
  @IsUrl()
  public url: string;

  @ApiProperty({
    description: 'Tags associated with the video post.',
    example: ['adventure', 'travel'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public tags?: string[];
}

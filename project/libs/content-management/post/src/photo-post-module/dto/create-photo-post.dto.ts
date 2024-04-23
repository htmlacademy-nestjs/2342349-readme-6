import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePhotoPostDto {
  @ApiProperty({
    description: 'The URL of the photo.',
    example: 'https://example.com/photo.jpg'
  })
  @IsOptional()
  @IsUrl()
  public url: string;

  @ApiProperty({
    description: 'Tags associated with the photo post.',
    example: ['nature', 'photography'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public tags?: string[];
}

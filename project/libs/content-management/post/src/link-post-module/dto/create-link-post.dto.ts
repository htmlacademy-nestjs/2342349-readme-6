import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLinkPostDto {
  @ApiProperty({
    description: 'The URL of the link post.',
    example: 'https://example.com/article'
  })
  @IsUrl()
  public url: string;

  @ApiProperty({
    description: 'A short description of the link post.',
    example: 'This is an interesting article about technology.'
  })
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'Tags associated with the post.',
    example: ['tech', 'news'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public tags?: string[];
}

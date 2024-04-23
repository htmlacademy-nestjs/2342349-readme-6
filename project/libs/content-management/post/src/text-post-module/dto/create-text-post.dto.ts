import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTextPostDto {
  @ApiProperty({
    description: 'The title of the text post.',
    example: 'New Perspectives on Software Development'
  })
  @IsString()
  public title: string;

  @ApiProperty({
    description: 'A brief announcement or summary of the text post.',
    example: 'Exploring innovative approaches to modern software practices.'
  })
  @IsString()
  public announcement: string;

  @ApiProperty({
    description: 'The full text content of the post.',
    example: 'In this article, we delve into various methodologies...'
  })
  @IsString()
  public text: string;

  @ApiProperty({
    description: 'Tags associated with the text post.',
    example: ['software', 'development'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public tags?: string[];
}

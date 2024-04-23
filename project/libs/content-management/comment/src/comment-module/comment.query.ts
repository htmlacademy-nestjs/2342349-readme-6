import { SortDirection } from '@project/shared-core';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CommentQuery {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public limit?: number;

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection?: SortDirection;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public page?: number;
}

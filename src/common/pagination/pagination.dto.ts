import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Número de página para la paginación',
    example: 1,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    required: false,
    description: 'Número de elementos por página para la paginación',
    example: 10,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  page?: number = 1;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Corte de cabello',
    description: 'Nombre del servicio',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Corte clásico con navaja',
    description: 'Descripción del servicio',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 25.0, description: 'Precio del servicio' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @Min(0.01)
  price: number;

  @ApiProperty({ example: 60, description: 'Duración en minutos' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(5)
  @Max(1440)
  durationMinutes: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Si el servicio está activo',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

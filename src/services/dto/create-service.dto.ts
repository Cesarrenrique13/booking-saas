import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @Min(0.01)
  price: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(5)
  @Max(1440)
  durationMinutes: number;

  @IsUUID()
  @IsNotEmpty()
  businessId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

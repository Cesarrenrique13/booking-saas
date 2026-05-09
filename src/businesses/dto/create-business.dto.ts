import { BusinessCategory } from '@/businesses/enums/business-category.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(BusinessCategory)
  @IsNotEmpty()
  category: BusinessCategory;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsString()
  @IsOptional()
  @MaxLength(60)
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  @Matches(/^[0-9]+$/, { message: 'Phone must contain only numbers' })
  phone?: string;
}

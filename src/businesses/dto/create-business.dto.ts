import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Peluquería Canina',
    description: 'Nombre del negocio',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Corte y baño para perros',
    description: 'Descripción del negocio',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: BusinessCategory,
    example: 'BABER_SHOP',
    description: 'Categoría del negocio',
  })
  @IsEnum(BusinessCategory)
  @IsNotEmpty()
  category: BusinessCategory;

  @ApiProperty({
    example: 'Calle 10 #20-30',
    description: 'Dirección del negocio',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiPropertyOptional({
    example: 'contacto@peluqueria.com',
    description: 'Email de contacto',
  })
  @IsString()
  @IsOptional()
  @MaxLength(60)
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '04121234567',
    description: 'Teléfono de contacto',
  })
  @IsString()
  @IsOptional()
  @MaxLength(15)
  @Matches(/^[0-9]+$/, { message: 'Phone must contain only numbers' })
  phone?: string;
}

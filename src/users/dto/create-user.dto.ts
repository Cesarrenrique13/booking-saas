import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ example: 'juan', description: 'user`s name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @IsEmail()
  @ApiProperty({ example: 'juan@gmail.com', description: 'user`s email' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]+$/, { message: 'Phone debe tener solo numeros' })
  @MaxLength(15)
  @ApiPropertyOptional({ example: '04246785932', description: 'User`s phone' })
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    example: ['user'],
    description: 'User roles (admin use only)',
  })
  roles?: string[];
}

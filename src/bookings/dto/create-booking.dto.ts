import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID del servicio a reservar',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    example: '2026-06-15T14:00:00.000Z',
    description: 'Fecha y hora de inicio de la reserva (ISO 8601)',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;
}

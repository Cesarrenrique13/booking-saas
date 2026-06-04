import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

export class UpdateBookingDto {
  @ApiPropertyOptional({
    enum: BookingStatus,
    example: BookingStatus.CANCELLED,
    description: 'Nuevo estado de la reserva',
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}

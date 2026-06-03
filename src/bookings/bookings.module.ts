import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { AuthModule } from '@/auth/auth.module';
import { BookingRepository } from './repositories/booking.repository';
import { ServicesModule } from '@/services/services.module';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, BookingRepository],
  imports: [TypeOrmModule.forFeature([Booking]), AuthModule, ServicesModule],
  exports: [TypeOrmModule],
})
export class BookingsModule {}

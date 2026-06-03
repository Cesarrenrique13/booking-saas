import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServiceRepository } from './repositories/services.repository';
import { Service } from './entities/service.entity';
import { BusinessesModule } from '@/businesses/businesses.module';
import { AuthModule } from '@/auth/auth.module';
import { BookingsModule } from '@/bookings/bookings.module';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, ServiceRepository],
  imports: [
    TypeOrmModule.forFeature([Service]),
    BusinessesModule,
    AuthModule,
    BookingsModule,
  ],
  exports: [ServicesService, TypeOrmModule],
})
export class ServicesModule {}

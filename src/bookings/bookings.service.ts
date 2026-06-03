import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User } from '@/users/entities/user.entity';
import { Booking } from './entities/booking.entity';
import { BookingRepository } from './repositories/booking.repository';
import { DataSource } from 'typeorm';
import { ServicesService } from '@/services/services.service';
import { PaginationDto } from '@/common/pagination/pagination.dto';
import { PaginationInterface } from '@/common/pagination/pagination.interface';
import { BusinessesService } from '@/businesses/businesses.service';
import { BookingStatus } from './enums/booking-status.enum';
import { DBError, PostgresErrorCode } from '@/common/db/db-error.types';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger('BookingService');

  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly servicesService: ServicesService,
    private readonly businessServices: BusinessesService,
    private readonly dataSource: DataSource,
  ) {}
  async create(data: CreateBookingDto, user: User): Promise<Booking> {
    const { serviceId, startTime: startTimeStr } = data;

    const service = await this.servicesService.findOne(serviceId);

    const startTime = new Date(startTimeStr);
    const endTime = new Date(
      startTime.getTime() + service.durationMinutes * 60000,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const overlap = await this.bookingRepo.checkOverlap(
        manager,
        serviceId,
        startTime,
        endTime,
      );

      if (overlap) {
        throw new BadRequestException(
          'The selected time slot is already booked.',
        );
      }

      const bookingData: Partial<Booking> = {
        startTime,
        endTime,
        totalPrice: service.price,
        serviceId,
        userId: user.id,
      };

      const newBooking = await this.bookingRepo.createBooking(
        manager,
        bookingData,
      );

      await queryRunner.commitTransaction();
      return newBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    pagination: PaginationDto & { userId?: string; businessId?: string },
    user: User,
  ): Promise<PaginationInterface<Booking>> {
    const { limit = 10, page = 1, userId, businessId } = pagination;

    const skip = (page - 1) * limit;

    const isAdmin =
      user.roles.includes('admin') || user.roles.includes('super-user');

    if (!isAdmin) {
      const [data, total] = await this.bookingRepo.findBookings(
        skip,
        limit,
        user.id,
        undefined,
      );
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    if (businessId) {
      const business = await this.businessServices.findOne(businessId);
      if (business.userId !== user.id && !user.roles.includes('super-user')) {
        throw new ForbiddenException('You do not own this business');
      }
    }

    const [data, total] = await this.bookingRepo.findBookings(
      skip,
      limit,
      userId,
      businessId,
    );
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user: User): Promise<Booking> {
    const booking = await this.bookingRepo.findBooking(id);

    if (!booking) {
      throw new NotFoundException(`Booking with id:${id} not found`);
    }

    if (user.roles.includes('admin') || user.roles.includes('super-user')) {
      return booking;
    }
    if (user.roles.includes('owner')) {
      if (booking.service.business.userId === user.id) return booking;
    }
    if (user.roles.includes('user')) {
      if (booking.userId === user.id) return booking;
    }

    throw new ForbiddenException('Forbidden');
  }

  async update(
    id: string,
    data: UpdateBookingDto,
    user: User,
  ): Promise<Booking> {
    await this.findOne(id, user);

    if (data.status) {
      if (user.roles.includes('user')) {
        if (data.status !== BookingStatus.CANCELLED) {
          throw new BadRequestException(
            'Customers can only change booking status to CANCELLED',
          );
        }
      }
    }
    return this.bookingRepo.updateBooking(id, data);
  }

  async remove(id: string, user: User): Promise<void> {
    const booking = await this.bookingRepo.findBooking(id);

    if (!booking) {
      throw new NotFoundException(`Booking with id: ${id} not found`);
    }

    if (user.roles.includes('user')) {
      throw new ForbiddenException(`Customers can't delete booking`);
    }
    if (user.roles.includes('owner')) {
      if (booking.service.business.userId !== user.id) {
        throw new ForbiddenException(`Only owner can delete bookings`);
      }
    }
    try {
      await this.bookingRepo.deleteBooking(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handleDBExceptions(error);
    }
  }

  handleDBExceptions(error: unknown): never {
    const err = error as DBError;

    if (err.code === PostgresErrorCode.UNIQUE_VIOLATION)
      throw new ConflictException(
        `Duplicate entry in table ${err.table}: ${err.detail}`,
      );

    if (err.code === PostgresErrorCode.FOREIGN_KEY_VIOLATION)
      throw new ConflictException(
        `Cannot create/update record: the related entity in table ${err.table} does not exist`,
      );

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}

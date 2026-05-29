import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
import { BookingStatus } from '../enums/booking-status.enum';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async checkOverlap(
    manager: EntityManager,
    serviceId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking | null> {
    const overlap = await manager
      .createQueryBuilder(Booking, 'booking')
      .where('booking.serviceId = :serviceId', { serviceId })
      .andWhere('booking.status in (:...blockingStatuses)', {
        blockingStatuses: [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.PAID,
        ],
      })
      .andWhere('booking.startTime < :endTime', { endTime })
      .andWhere('booking.endTime > :startTime', { startTime })
      .getOne();

    return overlap;
  }

  createBooking(
    manager: EntityManager,
    data: Partial<Booking>,
  ): Promise<Booking> {
    const booking = manager.create(Booking, data);
    return manager.save(booking);
  }

  findBookings(
    skip: number,
    take: number,
    userId?: string,
    businessId?: string,
  ): Promise<[Booking[], number]> {
    return this.bookingRepository.findAndCount({
      skip,
      take,
      relations: { service: { business: true }, user: true },
      where: {
        ...(userId && { userId }),
        ...(businessId && { service: { businessId } }),
      },
      order: { startTime: 'DESC' },
    });
  }

  findBooking(id: string): Promise<Booking | null> {
    return this.bookingRepository.findOne({
      where: { id },
      relations: { service: { business: true }, user: true },
    });
  }

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    const booking = await this.bookingRepository.preload({ id, ...data });

    if (!booking) {
      throw new NotFoundException(`Booking with id:${id} not found`);
    }

    return this.bookingRepository.save(booking);
  }

  async deleteBooking(id: string): Promise<DeleteResult> {
    const result = await this.bookingRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Booking with id:${id} not found`);
    }

    return result;
  }
}

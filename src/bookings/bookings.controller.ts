import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Auth, GetUser } from '@/auth/decorators';
import { User } from '@/users/entities/user.entity';
import { PaginationDto } from '@/common/pagination/pagination.dto';
import { PaginationInterface } from '@/common/pagination/pagination.interface';
import { Booking } from './entities/booking.entity';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @GetUser() user: User,
  ): Promise<Booking> {
    return this.bookingsService.create(createBookingDto, user);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all bookings (paginated)' })
  @ApiResponse({ status: 200, description: 'Returns paginated bookings' })
  async findAll(
    @Query()
    pagination: PaginationDto & { userId?: string; businessId?: string },
    @GetUser() user: User,
  ): Promise<PaginationInterface<Booking>> {
    return this.bookingsService.findAll(pagination, user);
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiResponse({ status: 200, description: 'Returns booking' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Booking> {
    return this.bookingsService.findOne(id, user);
  }

  @Patch(':id')
  @Auth()
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @GetUser() user: User,
  ): Promise<Booking> {
    return this.bookingsService.update(id, updateBookingDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    await this.bookingsService.remove(id, user);
    return { message: 'Booking deleted successfully' };
  }
}

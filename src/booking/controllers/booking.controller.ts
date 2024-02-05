import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BookingService } from '../services';
import { BookingEntity } from '../entities';
import { BookParkingSpotDto } from '../dto/book-parking-spot.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async getBookings(): Promise<BookingEntity[]> {
    return this.bookingService.getAll();
  }

  @Get(':bookingId')
  async getBooking(
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ): Promise<BookingEntity> {
    if (!(await this.bookingService.exists(bookingId))) {
      throw new NotFoundException('Booking not found!');
    }
    return this.bookingService.getById(bookingId);
  }

  @Post()
  async bookParkingSpot(
    @Body() bookParkingSpot: BookParkingSpotDto,
  ): Promise<void> {
    await this.bookingService.bookParkingSpot(bookParkingSpot);
  }

  @Delete(':bookingId')
  async delete(
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ): Promise<void> {
    if (!(await this.bookingService.exists(bookingId))) {
      throw new NotFoundException('Booking not found!');
    }
    await this.bookingService.delete(bookingId);
  }
}

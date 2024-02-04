import { Controller, Get, NotFoundException } from '@nestjs/common';
import { BookingService } from '../services/booking.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get(':bookingId')
  async getBooking(bookingId: number) {
    if (!(await this.bookingService.exists(bookingId))) {
      throw new NotFoundException('Booking not found!');
    }
    return this.bookingService.getById(bookingId);
  }
}

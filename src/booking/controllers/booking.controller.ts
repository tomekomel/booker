import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { BookingService } from '../services';
import { BookingEntity } from '../entities';
import { BookParkingSpotDto } from '../dto/book-parking-spot.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get(':bookingId')
  async getBooking(bookingId: number): Promise<BookingEntity> {
    if (!(await this.bookingService.exists(bookingId))) {
      throw new NotFoundException('Booking not found!');
    }
    return this.bookingService.getById(bookingId);
  }

  @Post()
  async bookParkingSpot(@Body() bookParkingSpot: BookParkingSpotDto): Promise<void> {
    await this.bookingService.bookParkingSpot(bookParkingSpot);
  }
}

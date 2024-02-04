import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';

@Module({
  controllers: [BookingController]
})
export class BookingModule {}

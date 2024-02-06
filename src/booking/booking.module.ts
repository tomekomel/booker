import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';
import { BookingService, ParkingSpotService, UserService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entitiesList } from '../database/entities-list';
import { BookingTimeValidationService } from './services/booking-time-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature(entitiesList)],
  controllers: [BookingController],
  providers: [
    BookingService,
    ParkingSpotService,
    UserService,
    BookingTimeValidationService,
  ],
})
export class BookingModule {}

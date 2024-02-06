import { BookingEntity } from '../entities';
import { CreateBookingDto } from '../dto/create-booking.dto';

export interface BookingServiceInterface {
  exists(id: number): Promise<boolean>;
  getById(id: number): Promise<BookingEntity>;
  delete(id: number): Promise<void>;
  bookParkingSpot(
    bookParkingSpotDto: CreateBookingDto,
    userId: number
  ): Promise<void>;
}

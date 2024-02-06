import { BookingEntity } from '../entities';
import { BookParkingSpotDto } from '../dto/book-parking-spot.dto';

export interface BookingServiceInterface {
  exists(id: number): Promise<boolean>;
  getById(id: number): Promise<BookingEntity>;
  delete(id: number): Promise<void>;
  bookParkingSpot(
    bookParkingSpotDto: BookParkingSpotDto,
    userId: number
  ): Promise<void>;
}

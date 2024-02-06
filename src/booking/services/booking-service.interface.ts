import { BookingEntity } from '../entities';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';

export interface BookingServiceInterface {
  exists(id: number): Promise<boolean>;
  getById(id: number): Promise<BookingEntity>;
  delete(id: number): Promise<void>;
  create(bookParkingSpotDto: CreateBookingDto, userId: number): Promise<void>;
  update(bookingId: number, updateBookingDto: UpdateBookingDto): Promise<void>;
}

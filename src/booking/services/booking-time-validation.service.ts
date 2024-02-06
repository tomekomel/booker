import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../entities';
import { Repository } from 'typeorm';
import { ConflictException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BookingTimeValidationService {
  private readonly logger = new Logger(BookingTimeValidationService.name);
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async validateBookingTime(
    parkingSpotId: number,
    startDate: Date,
    endDate: Date,
    bookingId?: number,
  ): Promise<void> {
    let query =
      'booking.parkingSpotId = :parkingSpotId AND ' +
      '((booking.startDate < :startDate AND booking.endDate > :startDate) OR ' +
      '(booking.startDate >= :startDate AND booking.startDate < :endDate))';

    if (bookingId) {
      query += ' AND booking.id != :bookingId';
    }

    const conflictingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where(query, {
        parkingSpotId,
        startDate,
        endDate,
        bookingId,
      })
      .getMany();

    if (conflictingBookings.length > 0) {
      const errorMessage = `Parking spot: [${parkingSpotId}] is already booked for that time: ${startDate} - ${endDate}.`;
      this.logger.error(errorMessage);
      throw new ConflictException(errorMessage);
    }
  }
}

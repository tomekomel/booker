import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../entities';
import { Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BookParkingSpotDto } from '../dto/book-parking-spot.dto';
import { ParkingSpotService } from './parking-spot.service';
import { UserService } from './user.service';
import { BookingServiceInterface } from './booking-service.interface';

@Injectable()
export class BookingService implements BookingServiceInterface {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    private readonly parkingSpotService: ParkingSpotService,
    private readonly userService: UserService,
  ) {}

  async exists(id: number): Promise<boolean> {
    return this.bookingRepository.existsBy({ id });
  }

  async getById(id: number): Promise<BookingEntity> {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['parking-spot', 'user'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.bookingRepository.delete(id);

    this.logger.log(`Booking with ID [${id}] deleted successfully.`);
  }

  async bookParkingSpot(bookParkingSpotDto: BookParkingSpotDto): Promise<void> {
    const { createdById, startDate, endDate, parkingSpotId } =
      bookParkingSpotDto;

    const createdBy = await this.userService.getById(createdById);
    if (!createdBy) {
      throw new NotFoundException(`User with id ${createdById} not found.`);
    }

    const parkingSpot = await this.parkingSpotService.getById(parkingSpotId);
    if (!parkingSpot) {
      throw new NotFoundException(
        `Parking spot with id ${parkingSpotId} not found.`,
      );
    }

    const existingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where(
        'booking.parkingSpotId = :parkingSpotId AND ' +
          '((booking.startDate <= :startDate AND booking.endDate >= :startDate) OR (booking.startDate >= :startDate AND booking.startDate <= :endDate))',
        {
          parkingSpotId: bookParkingSpotDto.parkingSpotId,
          startDate: bookParkingSpotDto.startDate,
          endDate: bookParkingSpotDto.endDate,
        },
      )
      .getMany();

    if (existingBookings.length > 0) {
      const errorMessage = `Parking spot: [${bookParkingSpotDto.parkingSpotId}] is already booked for that time: ${bookParkingSpotDto.startDate} - ${bookParkingSpotDto.endDate}.`;
      this.logger.error(errorMessage);
      throw new ConflictException(errorMessage);
    }

    const booking = new BookingEntity();
    booking.createdBy = createdBy;
    booking.startDate = startDate;
    booking.endDate = endDate;
    booking.parkingSpot = parkingSpot;

    await this.bookingRepository.save(booking);

    this.logger.log(
      `Booking for user: ${createdBy.firstName} ${createdBy.lastName} created successfully.`,
    );
  }
}

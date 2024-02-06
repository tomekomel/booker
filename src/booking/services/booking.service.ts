import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../entities';
import { Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { ParkingSpotService } from './parking-spot.service';
import { UserService } from './user.service';
import { BookingServiceInterface } from './booking-service.interface';
import { UserParamsInterface } from '../../authorisation/user-params.interface';
import { UserRole } from '../../authorisation/user-roles.enum';
import { UpdateBookingDto } from '../dto/update-booking.dto';

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

  async getAll(userParams: UserParamsInterface): Promise<BookingEntity[]> {
    if (userParams.role === UserRole.ADMIN) {
      return this.bookingRepository.find();
    } else if (userParams.role === UserRole.USER) {
      return this.bookingRepository.findBy({ createdById: userParams.userId });
    }
  }

  async getById(id: number): Promise<BookingEntity> {
    if (!(await this.exists(id))) {
      throw new NotFoundException(`Booking with ID [${id}] not found!`);
    }

    return this.bookingRepository.findOne({
      where: { id },
      relations: ['parkingSpot', 'createdBy'],
    });
  }

  async delete(id: number): Promise<void> {
    if (!(await this.exists(id))) {
      throw new NotFoundException(`Booking with ID [${id}] not found!`);
    }

    await this.bookingRepository.delete(id);

    this.logger.log(`Booking with ID [${id}] deleted successfully.`);
  }

  async bookParkingSpot(
    bookParkingSpotDto: CreateBookingDto,
    userId: number,
  ): Promise<void> {
    const { startDate, endDate, parkingSpotId } = bookParkingSpotDto;

    const createdBy = await this.userService.getById(userId);
    if (!createdBy) {
      throw new NotFoundException(`User with ID [${userId}] not found.`);
    }

    const parkingSpot = await this.parkingSpotService.getById(parkingSpotId);
    if (!parkingSpot) {
      throw new NotFoundException(
        `Parking spot with ID [${parkingSpotId}] not found.`,
      );
    }

    const conflictingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where(
        'booking.parkingSpotId = :parkingSpotId AND ' +
          '((booking.startDate < :startDate AND booking.endDate > :startDate) OR ' +
          '(booking.startDate >= :startDate AND booking.startDate < :endDate))',
        {
          parkingSpotId,
          startDate,
          endDate,
        },
      )
      .getMany();

    if (conflictingBookings.length > 0) {
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
      `Booking for parking spot: [${parkingSpotId}] for user: ${createdBy.firstName} ${createdBy.lastName} created successfully.`,
    );
  }

  async update(
    bookingId: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<void> {
    const booking = await this.getById(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID [${bookingId}] not found!`);
    }

    const { startDate, endDate, parkingSpotId } = updateBookingDto;

    const parkingSpot = await this.parkingSpotService.getById(parkingSpotId);
    if (!parkingSpot) {
      throw new NotFoundException(
        `Parking spot with ID [${parkingSpotId}] not found.`,
      );
    }

    const conflictingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where(
        'booking.parkingSpotId = :parkingSpotId AND ' +
          '((booking.startDate < :startDate AND booking.endDate > :startDate) OR ' +
          '(booking.startDate >= :startDate AND booking.startDate < :endDate))' +
          'AND booking.id != :bookingId',
        {
          parkingSpotId,
          startDate,
          endDate,
          bookingId,
        },
      )
      .getMany();

    if (conflictingBookings.length > 0) {
      const errorMessage = `Parking spot: [${parkingSpotId}] is already booked for that time: ${startDate} - ${endDate}.`;
      this.logger.error(errorMessage);
      throw new ConflictException(errorMessage);
    }

    booking.startDate = startDate;
    booking.endDate = endDate;
    booking.parkingSpot = parkingSpot;

    await this.bookingRepository.save(booking);

    this.logger.log(`Booking with ID [${bookingId}] updated successfully.`);
  }
}

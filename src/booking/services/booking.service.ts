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
import { BookingTimeValidationService } from './booking-time-validation.service';

@Injectable()
export class BookingService implements BookingServiceInterface {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    private readonly parkingSpotService: ParkingSpotService,
    private readonly userService: UserService,
    private readonly bookingTimeValidationService: BookingTimeValidationService,
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

  async create(
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

    await this.bookingTimeValidationService.validateBookingTime(
      parkingSpotId,
      startDate,
      endDate,
    );

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

    await this.bookingTimeValidationService.validateBookingTime(
        parkingSpotId,
        startDate,
        endDate,
        bookingId
    );

    booking.startDate = startDate;
    booking.endDate = endDate;
    booking.parkingSpot = parkingSpot;

    await this.bookingRepository.save(booking);

    this.logger.log(`Booking with ID [${bookingId}] updated successfully.`);
  }
}

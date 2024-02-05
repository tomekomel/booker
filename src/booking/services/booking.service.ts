import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../entities';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BookParkingSpotDto } from '../dto/book-parking-spot.dto';
import { ParkingSpotService } from './parking-spot.service';
import { UserService } from './user.service';

@Injectable()
export class BookingService {
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

  async bookParkingSpot(
    bookParkingSpotDto: BookParkingSpotDto,
  ): Promise<BookingEntity> {
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

    const booking = new BookingEntity();
    booking.createdBy = createdBy;
    booking.startDate = startDate;
    booking.endDate = endDate;
    booking.parkingSpot = parkingSpot;

    return this.bookingRepository.save(booking);
  }
}

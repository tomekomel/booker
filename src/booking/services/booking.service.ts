import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../entities';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
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
}

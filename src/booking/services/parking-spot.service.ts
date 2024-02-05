import { InjectRepository } from '@nestjs/typeorm';
import { ParkingSpotEntity } from '../entities';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParkingSpotService {
  constructor(
    @InjectRepository(ParkingSpotEntity)
    private readonly parkingSpotRepository: Repository<ParkingSpotEntity>,
  ) {}

  async exists(id: number): Promise<boolean> {
    return this.parkingSpotRepository.existsBy({ id });
  }

  async getById(id: number): Promise<ParkingSpotEntity> {
    return this.parkingSpotRepository.findOne({
      where: { id },
    });
  }
}

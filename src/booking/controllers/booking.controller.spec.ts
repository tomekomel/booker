import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService, ParkingSpotService, UserService } from '../services';
import { BookingTimeValidationService } from '../services/booking-time-validation.service';
import { Repository } from 'typeorm';
import { BookingEntity, ParkingSpotEntity, UserEntity } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BookingController', () => {
  let controller: BookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        Repository<BookingEntity>,
        BookingService,
        ParkingSpotService,
        UserService,
        BookingTimeValidationService,
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ParkingSpotEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

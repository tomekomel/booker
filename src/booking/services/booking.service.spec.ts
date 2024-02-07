import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { BookingEntity, ParkingSpotEntity, UserEntity } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto, UpdateBookingDto } from '../dto';
import { ParkingSpotService } from './parking-spot.service';
import { UserService } from './user.service';
import { BookingTimeValidationService } from './booking-time-validation.service';
import { NotFoundException } from '@nestjs/common';
import { UserRole } from '../../authorisation/user-roles.enum';
import { UserParamsInterface } from '../../authorisation/user-params.interface';

describe('BookingService', () => {
  let bookingService: BookingService;
  let bookingRepository: Repository<BookingEntity>;
  let parkingSpotService: ParkingSpotService;
  let userService: UserService;
  let bookingTimeValidationService: BookingTimeValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        ParkingSpotService,
        UserService,
        BookingTimeValidationService,
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            existsBy: jest.fn(),
            find: jest.fn(),
            findBy: jest.fn(),
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

    bookingService = module.get<BookingService>(BookingService);
    bookingRepository = module.get<Repository<BookingEntity>>(
      getRepositoryToken(BookingEntity),
    );
    parkingSpotService = module.get<ParkingSpotService>(ParkingSpotService);
    userService = module.get<UserService>(UserService);
    bookingTimeValidationService = module.get<BookingTimeValidationService>(
      BookingTimeValidationService,
    );
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const createBookingDto: CreateBookingDto = {
        startDate: new Date(),
        endDate: new Date(),
        parkingSpotId: 1,
      };

      const userId = 1;
      const user = { id: userId } as UserEntity;
      const parkingSpot = {
        id: createBookingDto.parkingSpotId,
      } as ParkingSpotEntity;

      const booking: BookingEntity = {
        createdBy: user,
        startDate: new Date(),
        endDate: new Date(),
        parkingSpot: parkingSpot,
      } as BookingEntity;

      jest.spyOn(userService, 'getById').mockResolvedValueOnce(user);
      jest
        .spyOn(parkingSpotService, 'getById')
        .mockResolvedValueOnce(parkingSpot);
      jest
        .spyOn(bookingTimeValidationService, 'validateBookingTime')
        .mockResolvedValueOnce();

      await bookingService.create(createBookingDto, userId);

      expect(
        bookingTimeValidationService.validateBookingTime,
      ).toHaveBeenCalled();
      expect(bookingRepository.save).toHaveBeenCalledWith(booking);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const bookingId = 1;
      const updateBookingDto: UpdateBookingDto = {
        startDate: new Date(),
        endDate: new Date(),
        parkingSpotId: 1,
      };

      const booking: BookingEntity = {
        id: bookingId,
        startDate: new Date(),
        endDate: new Date(),
        parkingSpotId: 1,
      } as BookingEntity;
      const parkingSpot = {
        id: updateBookingDto.parkingSpotId,
      } as ParkingSpotEntity;

      jest.spyOn(bookingService, 'getById').mockResolvedValueOnce(booking);
      jest
        .spyOn(parkingSpotService, 'getById')
        .mockResolvedValueOnce(parkingSpot);
      jest
        .spyOn(bookingTimeValidationService, 'validateBookingTime')
        .mockResolvedValueOnce();

      await bookingService.update(bookingId, updateBookingDto);

      expect(
        bookingTimeValidationService.validateBookingTime,
      ).toHaveBeenCalled();
      expect(bookingRepository.save).toHaveBeenCalledWith(booking);
    });
  });

  describe('exists', () => {
    it('should return true if booking exists', async () => {
      jest.spyOn(bookingRepository, 'existsBy').mockResolvedValueOnce(true);

      const result = await bookingService.exists(1);

      expect(result).toEqual(true);
    });

    it('should return false if booking does not exist', async () => {
      jest.spyOn(bookingRepository, 'existsBy').mockResolvedValueOnce(false);

      const result = await bookingService.exists(1);

      expect(result).toEqual(false);
    });
  });

  describe('getAll', () => {
    it('should return all bookings for admin user', async () => {
      const adminParams: UserParamsInterface = {
        userId: 1,
        role: UserRole.ADMIN,
      };
      const bookings: BookingEntity[] = [{}, {}] as any;
      jest.spyOn(bookingRepository, 'find').mockResolvedValueOnce(bookings);

      const result = await bookingService.getAll(adminParams);

      expect(result).toEqual(bookings);
    });

    it('should return bookings created by standard user', async () => {
      const userParams: UserParamsInterface = {
        userId: 1,
        role: UserRole.USER,
      };
      const bookings: BookingEntity[] = [{}, {}] as any;
      jest.spyOn(bookingRepository, 'findBy').mockResolvedValueOnce(bookings);

      const result = await bookingService.getAll(userParams);

      expect(result).toEqual(bookings);
    });
  });

  describe('getById', () => {
    it('should return booking by id if exists', async () => {
      const bookingId = 1;
      const booking: BookingEntity = {} as any;

      jest.spyOn(bookingRepository, 'existsBy').mockResolvedValueOnce(true);
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValueOnce(booking);

      const result = await bookingService.getById(bookingId);

      expect(result).toEqual(booking);
    });

    it('should throw NotFoundException if booking does not exist', async () => {
      const bookingId = 1;

      jest.spyOn(bookingRepository, 'existsBy').mockResolvedValueOnce(false);
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(bookingService.getById(bookingId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete booking if exists', async () => {
      const bookingId = 1;
      jest.spyOn(bookingRepository, 'existsBy').mockResolvedValueOnce(true);

      await bookingService.delete(bookingId);

      expect(bookingRepository.delete).toHaveBeenCalledWith(bookingId);
    });

    it('should throw NotFoundException if booking does not exist', async () => {
      const bookingId = 1;
      jest.spyOn(bookingRepository, 'existsBy').mockResolvedValueOnce(false);

      await expect(bookingService.delete(bookingId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});

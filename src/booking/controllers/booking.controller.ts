import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from '../services';
import { BookingEntity } from '../entities';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { AuthorisedUserParams } from '../../authorisation/decorators';
import { UserParamsInterface } from '../../authorisation/user-params.interface';
import { CanAccessBookingGuard } from '../../authorisation/guards/can-access-booking.guard';
import { UpdateBookingDto } from '../dto/update-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async getBookings(
    @AuthorisedUserParams() userParams: UserParamsInterface,
  ): Promise<BookingEntity[]> {
    return this.bookingService.getAll(userParams);
  }

  @Get(':bookingId')
  @UseGuards(CanAccessBookingGuard)
  async getBooking(
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ): Promise<BookingEntity> {
    return this.bookingService.getById(bookingId);
  }

  @Post()
  async createBooking(
    @Body() bookParkingSpot: CreateBookingDto,
    @AuthorisedUserParams() userParams: UserParamsInterface,
  ): Promise<void> {
    await this.bookingService.create(
      bookParkingSpot,
      userParams.userId,
    );
  }

  @Put(':bookingId')
  @UseGuards(CanAccessBookingGuard)
  async updateBooking(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<void> {
    await this.bookingService.update(bookingId, updateBookingDto);
  }

  @Delete(':bookingId')
  @UseGuards(CanAccessBookingGuard)
  async delete(
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ): Promise<void> {
    await this.bookingService.delete(bookingId);
  }
}

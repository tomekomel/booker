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
import { CreateBookingDto, UpdateBookingDto } from '../dto';
import { AuthorisedUserParams } from '../../authorisation/decorators';
import { UserParams } from '../../authorisation/user.params';
import { CanAccessBookingGuard } from '../../authorisation/guards/can-access-booking.guard';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async getBookings(
    @AuthorisedUserParams() userParams: UserParams,
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
    @Body() createBookingDto: CreateBookingDto,
    @AuthorisedUserParams() userParams: UserParams,
  ): Promise<void> {
    await this.bookingService.create(createBookingDto, userParams.userId);
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

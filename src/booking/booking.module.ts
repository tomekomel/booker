import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entitiesList } from '../database/entities-list';

@Module({
  imports: [TypeOrmModule.forFeature(entitiesList)],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}

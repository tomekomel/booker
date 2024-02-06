import { IsDateString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  parkingSpotId: number;
}

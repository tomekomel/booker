import { IsDateString, IsNumber } from 'class-validator';

export class UpdateBookingDto {
  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  parkingSpotId: number;
}

import { IsDate, IsNumber } from 'class-validator';

export class BookParkingSpotDto {
  @IsNumber()
  createdById: number;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsNumber()
  parkingSpotId: number;
}

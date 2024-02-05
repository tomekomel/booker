import { IsDateString, IsNumber} from 'class-validator';

export class BookParkingSpotDto {
  @IsNumber()
  createdById: number;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  parkingSpotId: number;
}

import { IsDateString, IsNumber} from 'class-validator';

export class BookParkingSpotDto {
  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  parkingSpotId: number;
}

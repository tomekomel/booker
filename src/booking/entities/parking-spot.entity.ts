import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('parking_spot')
export class ParkingSpotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

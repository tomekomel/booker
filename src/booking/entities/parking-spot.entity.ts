import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ParkingSpotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

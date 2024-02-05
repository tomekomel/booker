import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParkingSpots1707091242369 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('parking_spot')
      .values([
        {
          id: null,
          name: 'A1',
        },
        {
          id: null,
          name: 'A2',
        },
        {
          id: null,
          name: 'A3',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

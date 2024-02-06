import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminAndUser1707086879349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user')
      .values([
        {
          id: null,
          firstName: 'Tom',
          lastName: 'Book',
          email: 'tom@book.com',
          role: 'user',
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.8aOP6TSAYKGphtUf7LCG0uQcgERrDAjTCbfOJrnV290',
        },
        {
          id: null,
          firstName: 'Jeff',
          lastName: 'Boss',
          email: 'jeff@book.com',
          role: 'admin',
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.5iVcEnlVHQS72AFmMY9cln5A5eQTvPWaNC94Lbx8-8M',
        },
        {
          id: null,
          firstName: 'Camila',
          lastName: 'Owner',
          email: 'camila@book.com',
          role: 'user',
          token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.wPz2OwQuB4WTzew7NE1Bdbbk3mCiqI7zvFUfrPyB1I0',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

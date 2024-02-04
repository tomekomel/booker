import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1707078075295 implements MigrationInterface {
    name = 'CreateTables1707078075295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parking_spot" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_15bcb502057157741cff7a11ece" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "createdById" integer NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, "parkingSpotId" integer NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_2f4c608bdc1d391d5953bbbfb9d" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_d9fc0d08be260698c3f6af9818e" FOREIGN KEY ("parkingSpotId") REFERENCES "parking_spot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_d9fc0d08be260698c3f6af9818e"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_2f4c608bdc1d391d5953bbbfb9d"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TABLE "parking_spot"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

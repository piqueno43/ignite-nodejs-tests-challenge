import {Column, MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterStatementsType1632743768488 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.changeColumn(
        "statements",
        "type",
        new TableColumn({
          name: "type",
          type: "enum",
          enum: ['deposit', 'withdraw', "transfer"],
          isNullable: true,
        })
      );

      await queryRunner.addColumn(
        "statements",
        new TableColumn({
          name: "sender_id",
          type: "uuid",
          isNullable: true,
        })
      )
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn("statements", "sender_id");
      await queryRunner.changeColumn(
        "statements",
        "type",
        new TableColumn({
          name: "type",
          type: "enum",
          enum: ['deposit', 'withdraw'],
          isNullable: true,
        }))
    }

}

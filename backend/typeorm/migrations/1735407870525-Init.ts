import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1735407870525 implements MigrationInterface {
  name = 'Init1735407870525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`payment\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`number\` int NOT NULL, \`due_date\` json NOT NULL, \`cprId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`company\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`email\` varchar(255) NULL, \`cnpj\` varchar(255) NOT NULL, \`legal_name\` varchar(255) NOT NULL, \`inscricao_estadual\` varchar(255) NOT NULL, \`legal_representative_name\` varchar(255) NULL, \`legal_representative_cpf\` varchar(255) NULL, \`addressId\` varchar(36) NULL, UNIQUE INDEX \`REL_3737905699894299444476dd79\` (\`addressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`spouse\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`email\` varchar(255) NULL, \`cpf\` varchar(255) NOT NULL, \`rg_number\` varchar(255) NOT NULL, \`rg_emited_by\` varchar(255) NOT NULL, \`rg_emited_date\` datetime NOT NULL, \`addressId\` varchar(36) NULL, UNIQUE INDEX \`REL_7ad5a2ec0cdbe172c194fa388b\` (\`addressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`individual\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`email\` varchar(255) NULL, \`cpf\` varchar(255) NOT NULL, \`gender\` varchar(255) NOT NULL, \`rg_number\` varchar(255) NULL, \`rg_emited_by\` varchar(255) NULL, \`rg_emited_date\` datetime NULL, \`marital_status\` enum ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWER', 'SEPARATE') NULL, \`matrimonial_regime\` enum ('PARTIAL_COMMUNION', 'UNIVERSAL_COMMINUION', 'TOTAL_SEPARATION', 'MANDATORY_SEPARATION', 'FINAL_PARTCIPATION') NULL, \`profession\` varchar(255) NULL, \`addressId\` varchar(36) NULL, \`spouseId\` varchar(36) NULL, UNIQUE INDEX \`REL_62ce5df4bc643834e8f4266560\` (\`addressId\`), UNIQUE INDEX \`REL_98d575c9f7fe0eedac823758ef\` (\`spouseId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`rent_registry\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`number\` varchar(255) NOT NULL, \`regitry_place_name\` varchar(255) NOT NULL, \`book\` varchar(255) NULL, \`sheet\` varchar(255) NULL, \`regitry_date\` datetime NULL, \`type_of_possession_enum\` enum ('FULL', 'DIRECT', 'INDIRECT') NULL, \`initial_date\` datetime NOT NULL, \`final_date\` datetime NOT NULL, \`addressId\` varchar(36) NULL, UNIQUE INDEX \`REL_c34a09d6fa545add44acfdfda5\` (\`addressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`farm\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`inscricao_estadual\` varchar(255) NOT NULL, \`tatal_area\` int NOT NULL, \`cultivated_area\` int NOT NULL, \`nirf\` varchar(255) NOT NULL, \`possession\` enum ('OWNER', 'RENT') NOT NULL, \`addressId\` varchar(36) NULL, \`siteRegistryId\` varchar(36) NULL, \`rentRegistryId\` varchar(36) NULL, \`emitterId\` varchar(36) NULL, UNIQUE INDEX \`REL_c7f7442596cff1cef181b49c62\` (\`addressId\`), UNIQUE INDEX \`REL_e903454c49e25d21b60f36afe9\` (\`siteRegistryId\`), UNIQUE INDEX \`REL_df2390bacd8778e0e02d21587f\` (\`rentRegistryId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`emitter\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`companyId\` varchar(36) NULL, \`individualId\` varchar(36) NULL, UNIQUE INDEX \`REL_fd9d5ac6540b69fca7b9b7caf2\` (\`companyId\`), UNIQUE INDEX \`REL_32c7f48e0e3f365cad220ac18c\` (\`individualId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`delivery_place\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`email\` varchar(255) NULL, \`cnpj\` varchar(255) NOT NULL, \`legal_name\` varchar(255) NOT NULL, \`inscricao_estadual\` varchar(255) NOT NULL, \`legal_representative_name\` varchar(255) NULL, \`legal_representative_cpf\` varchar(255) NULL, \`addressId\` varchar(36) NULL, UNIQUE INDEX \`REL_7dca5a82522c6e3bedce8664e0\` (\`addressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cpr\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`number\` varchar(255) NOT NULL, \`creditor_details\` json NOT NULL, \`emitter_details\` json NOT NULL, \`guarantor\` json NOT NULL, \`product\` json NOT NULL, \`crop\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`product_development_site_details\` json NOT NULL, \`delivery_place_details\` json NOT NULL, \`issue_date\` datetime NOT NULL, \`responsible_for_expenses\` enum ('CREDITOR', 'EMITTER') NOT NULL, \`creditorId\` varchar(36) NULL, \`emitterId\` varchar(36) NULL, \`productDevelopmentSiteId\` varchar(36) NULL, \`deliveryPlaceId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`creditor\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`email\` varchar(255) NULL, \`cnpj\` varchar(255) NOT NULL, \`legal_name\` varchar(255) NOT NULL, \`inscricao_estadual\` varchar(255) NOT NULL, \`legal_representative_name\` varchar(255) NULL, \`legal_representative_cpf\` varchar(255) NULL, \`addressId\` varchar(36) NULL, UNIQUE INDEX \`REL_6c982c4b555bf1ebd71811d64e\` (\`addressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`address\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`postal_code\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`public_area\` varchar(255) NOT NULL, \`number\` varchar(255) NULL, \`complement\` varchar(255) NULL, \`district\` varchar(255) NOT NULL, \`mailbox\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`site_registry\` (\`id\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`number\` varchar(255) NOT NULL, \`regitry_place_name\` varchar(255) NOT NULL, \`book\` varchar(255) NULL, \`sheet\` varchar(255) NULL, \`regitry_date\` datetime NULL, \`type_of_possession_enum\` enum ('FULL', 'DIRECT', 'INDIRECT') NULL, \`addressId\` varchar(36) NULL, UNIQUE INDEX \`REL_63794a0c4f6a7f0ef6fca90680\` (\`addressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_d0b7dd1df4ea0cdaea964ef029e\` FOREIGN KEY (\`cprId\`) REFERENCES \`cpr\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` ADD CONSTRAINT \`FK_3737905699894299444476dd79c\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`spouse\` ADD CONSTRAINT \`FK_7ad5a2ec0cdbe172c194fa388bc\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`individual\` ADD CONSTRAINT \`FK_62ce5df4bc643834e8f42665601\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`individual\` ADD CONSTRAINT \`FK_98d575c9f7fe0eedac823758ef6\` FOREIGN KEY (\`spouseId\`) REFERENCES \`spouse\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`rent_registry\` ADD CONSTRAINT \`FK_c34a09d6fa545add44acfdfda50\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farm\` ADD CONSTRAINT \`FK_c7f7442596cff1cef181b49c62f\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farm\` ADD CONSTRAINT \`FK_e903454c49e25d21b60f36afe9b\` FOREIGN KEY (\`siteRegistryId\`) REFERENCES \`site_registry\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farm\` ADD CONSTRAINT \`FK_df2390bacd8778e0e02d21587f4\` FOREIGN KEY (\`rentRegistryId\`) REFERENCES \`rent_registry\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`farm\` ADD CONSTRAINT \`FK_db5cd04524d91ece5bbe9a2c51a\` FOREIGN KEY (\`emitterId\`) REFERENCES \`emitter\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`emitter\` ADD CONSTRAINT \`FK_fd9d5ac6540b69fca7b9b7caf2a\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`emitter\` ADD CONSTRAINT \`FK_32c7f48e0e3f365cad220ac18c9\` FOREIGN KEY (\`individualId\`) REFERENCES \`individual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`delivery_place\` ADD CONSTRAINT \`FK_7dca5a82522c6e3bedce8664e0a\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cpr\` ADD CONSTRAINT \`FK_710898c8675ccc66804f49a2e16\` FOREIGN KEY (\`creditorId\`) REFERENCES \`creditor\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cpr\` ADD CONSTRAINT \`FK_4a2d721559e2a634eca63a307d3\` FOREIGN KEY (\`emitterId\`) REFERENCES \`emitter\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cpr\` ADD CONSTRAINT \`FK_c4874f4312dacbd1338fd95b84f\` FOREIGN KEY (\`productDevelopmentSiteId\`) REFERENCES \`farm\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cpr\` ADD CONSTRAINT \`FK_8508e70c8982e5e1d9763017f8d\` FOREIGN KEY (\`deliveryPlaceId\`) REFERENCES \`delivery_place\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`creditor\` ADD CONSTRAINT \`FK_6c982c4b555bf1ebd71811d64e1\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`site_registry\` ADD CONSTRAINT \`FK_63794a0c4f6a7f0ef6fca906809\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`site_registry\` DROP FOREIGN KEY \`FK_63794a0c4f6a7f0ef6fca906809\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`creditor\` DROP FOREIGN KEY \`FK_6c982c4b555bf1ebd71811d64e1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cpr\` DROP FOREIGN KEY \`FK_8508e70c8982e5e1d9763017f8d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cpr\` DROP FOREIGN KEY \`FK_c4874f4312dacbd1338fd95b84f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cpr\` DROP FOREIGN KEY \`FK_4a2d721559e2a634eca63a307d3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cpr\` DROP FOREIGN KEY \`FK_710898c8675ccc66804f49a2e16\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`delivery_place\` DROP FOREIGN KEY \`FK_7dca5a82522c6e3bedce8664e0a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`emitter\` DROP FOREIGN KEY \`FK_32c7f48e0e3f365cad220ac18c9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`emitter\` DROP FOREIGN KEY \`FK_fd9d5ac6540b69fca7b9b7caf2a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farm\` DROP FOREIGN KEY \`FK_db5cd04524d91ece5bbe9a2c51a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farm\` DROP FOREIGN KEY \`FK_df2390bacd8778e0e02d21587f4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farm\` DROP FOREIGN KEY \`FK_e903454c49e25d21b60f36afe9b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`farm\` DROP FOREIGN KEY \`FK_c7f7442596cff1cef181b49c62f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`rent_registry\` DROP FOREIGN KEY \`FK_c34a09d6fa545add44acfdfda50\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`individual\` DROP FOREIGN KEY \`FK_98d575c9f7fe0eedac823758ef6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`individual\` DROP FOREIGN KEY \`FK_62ce5df4bc643834e8f42665601\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`spouse\` DROP FOREIGN KEY \`FK_7ad5a2ec0cdbe172c194fa388bc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` DROP FOREIGN KEY \`FK_3737905699894299444476dd79c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_d0b7dd1df4ea0cdaea964ef029e\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_63794a0c4f6a7f0ef6fca90680\` ON \`site_registry\``,
    );
    await queryRunner.query(`DROP TABLE \`site_registry\``);
    await queryRunner.query(`DROP TABLE \`address\``);
    await queryRunner.query(
      `DROP INDEX \`REL_6c982c4b555bf1ebd71811d64e\` ON \`creditor\``,
    );
    await queryRunner.query(`DROP TABLE \`creditor\``);
    await queryRunner.query(`DROP TABLE \`cpr\``);
    await queryRunner.query(
      `DROP INDEX \`REL_7dca5a82522c6e3bedce8664e0\` ON \`delivery_place\``,
    );
    await queryRunner.query(`DROP TABLE \`delivery_place\``);
    await queryRunner.query(
      `DROP INDEX \`REL_32c7f48e0e3f365cad220ac18c\` ON \`emitter\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_fd9d5ac6540b69fca7b9b7caf2\` ON \`emitter\``,
    );
    await queryRunner.query(`DROP TABLE \`emitter\``);
    await queryRunner.query(
      `DROP INDEX \`REL_df2390bacd8778e0e02d21587f\` ON \`farm\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_e903454c49e25d21b60f36afe9\` ON \`farm\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_c7f7442596cff1cef181b49c62\` ON \`farm\``,
    );
    await queryRunner.query(`DROP TABLE \`farm\``);
    await queryRunner.query(
      `DROP INDEX \`REL_c34a09d6fa545add44acfdfda5\` ON \`rent_registry\``,
    );
    await queryRunner.query(`DROP TABLE \`rent_registry\``);
    await queryRunner.query(
      `DROP INDEX \`REL_98d575c9f7fe0eedac823758ef\` ON \`individual\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_62ce5df4bc643834e8f4266560\` ON \`individual\``,
    );
    await queryRunner.query(`DROP TABLE \`individual\``);
    await queryRunner.query(
      `DROP INDEX \`REL_7ad5a2ec0cdbe172c194fa388b\` ON \`spouse\``,
    );
    await queryRunner.query(`DROP TABLE \`spouse\``);
    await queryRunner.query(
      `DROP INDEX \`REL_3737905699894299444476dd79\` ON \`company\``,
    );
    await queryRunner.query(`DROP TABLE \`company\``);
    await queryRunner.query(`DROP TABLE \`payment\``);
  }
}

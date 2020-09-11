import * as Knex from "knex";
import * as models from "../models";

export async function up(knex: Knex): Promise<any> {
  const hasChangeOwners = await knex.schema.hasTable("linkChangeOwners");
  if (!hasChangeOwners) {
    await models.createLinkChangeOwnersTable(knex);
  }
}

export async function down(knex: Knex): Promise<any> {
  return null;
}

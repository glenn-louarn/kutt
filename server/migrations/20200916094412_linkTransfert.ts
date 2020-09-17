import * as Knex from "knex";
import * as models from "../models";

export async function up(knex: Knex): Promise<any> {
  const hasLinkTransferts = await knex.schema.hasTable("linkTransferts");
  if (!hasLinkTransferts) {
    await models.createLinkTransfertTable(knex);
  }
}

export async function down(knex: Knex): Promise<any> {
  return null;
}

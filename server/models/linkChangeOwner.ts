import * as Knex from "knex";

export async function createLinkChangeOwnersTable(knex: Knex) {
  const hasTable = await knex.schema.hasTable("linkChangeOwners");

  if (!hasTable) {
    await knex.schema.createTable("linkChangeOwners", table => {
      table.increments("id").primary();
      table
        .integer("owner")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("newOwner")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("link_id")
        .references("id")
        .inTable("links")
        .notNullable()
        .onDelete("CASCADE");
      table
        .string("status") //onHold, accept, refuse
        .notNullable();
      table.timestamps(false, true);
    });
  }
}

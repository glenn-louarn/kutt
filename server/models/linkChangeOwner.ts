import * as Knex from "knex";

export async function createLinkChangeOwnerTable(knex: Knex) {
  const hasTable = await knex.schema.hasTable("linkChangeOwner");

  if (!hasTable) {
    await knex.schema.createTable("linkChangeOwner", table => {
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
        .inTable("link");
      table
        .string("status") //onHold, accept, refuse
        .unique()
        .notNullable();
      table.timestamps(false, true);
    });
  }
}

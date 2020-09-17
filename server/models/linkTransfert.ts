import * as Knex from "knex";

export async function createLinkTransfertTable(knex: Knex) {
  const hasTable = await knex.schema.hasTable("linkTransferts");

  if (!hasTable) {
    await knex.schema.createTable("linkTransferts", table => {
      table.increments("id").primary();
      table
        .integer("sender_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("receiver_id")
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
        .string("status") //on_hold, accepted, refused, canceled
        .notNullable();
      table
        .string("type") // claim, give
        .notNullable();
      table.boolean("sender_delete").notNullable();
      table.boolean("receiver_delete").notNullable();
      table.timestamps(false, true);
    });
  }
}

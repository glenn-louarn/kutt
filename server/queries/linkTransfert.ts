import { CustomError } from "../utils";
import knex from "../knex";

interface Create {
  link_id: number;
  type: TypeLinkTransfert;
  status: StatusLinkTransfert;
  receiver_id: number;
  sender_id: number;
  receiver_delete: boolean;
  sender_delete: boolean;
}
export const create = async (params: Create) => {
  const {
    link_id,
    type,
    status,
    receiver_id,
    sender_id,
    receiver_delete,
    sender_delete
  } = params;

  const [linkTransfert]: LinkTransfert[] = await knex<LinkTransfert>(
    "linkTransferts"
  ).insert(
    {
      link_id,
      type: type.toString(),
      status: status.toString(),
      receiver_id,
      sender_id,
      receiver_delete,
      sender_delete
    },
    "*"
  );
  return linkTransfert;
};

//TODO  A voir si on enleve
export const remove = async (match: Partial<Link>) => {
  const link = await knex<Link>("links")
    .where(match)
    .first();

  if (!link) {
    throw new CustomError("Link was not found.");
  }

  const deletedLink = await knex<Link>("links")
    .where("id", link.id)
    .delete();

  return !!deletedLink;
};

export const update = async (
  match: Partial<LinkTransfert>,
  update: Partial<LinkTransfert>
) => {
  const links = await knex<LinkTransfert>("linkTransferts")
    .where(match)
    .update({ ...update, updated_at: new Date().toISOString() }, "*");

  return links;
};

export const get = async (match: Partial<LinkTransfert>) => {
  const linkTransfert = await knex<LinkTransfert>("linkTransferts").where(
    match
  );
  return linkTransfert;
};

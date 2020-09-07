import { CustomError } from "../utils";
import knex from "../knex";

//TODO remettre redis
// const selectable = [
//   "linkChangeOwner.id",
//   "linkChangeOwner.created_at",
//   "linkChangeOwner.domain_id",
//   "linkChangeOwner.owner",
//   "linkChangeOwner.newOwner",
//   "linkChangeOwner.link_id",
//   "linkChangeOwner.status"
// ];

interface Create {
  owner: number;
  newOwner: number;
  link_id: number;
  status: string;
}

export const create = async (params: Create) => {
  const [linkChangeOwner]: LinkChangeOwner[] = await knex<LinkChangeOwner>(
    "linkChangeOwner"
  ).insert(
    {
      owner: params.owner,
      newOwner: params.newOwner,
      link_id: params.link_id,
      status: params.status
    },
    "*"
  );
  return linkChangeOwner;
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
  match: Partial<LinkChangeOwner>,
  update: Partial<LinkChangeOwner>
) => {
  const links = await knex<LinkChangeOwner>("linkChangeOwner")
    .where(match)
    .update({ ...update, updated_at: new Date().toISOString() }, "*");

  return links;
};

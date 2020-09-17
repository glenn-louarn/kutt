import { Handler } from "express";
import query from "../queries";
import knex from "../knex";
import { CustomError, TypeLinkTransfert, StatusLinkTransfert } from "../utils";

// import * as utils from "../utils";s

export const get: Handler = async (req, res) => {
  //TODO ne pas renvoyer les liens delete soft
  const user_id = req?.user?.id;
  // GIVE
  const match = { receiver_id: user_id };
  const linkTransfertGive = await query.linkTransfert.get(match);
  // CLAIM
  const match2 = { sender_id: user_id };
  const linkTransfertClaim = await query.linkTransfert.get(match2);
  // TODO prendre en compte plusieurs demande pagination
  console.log("linkTransfertClaim=================================+++> ", {
    ...linkTransfertGive,
    ...linkTransfertClaim
  });
  return res.status(200).send({ ...linkTransfertGive, ...linkTransfertClaim });
};
const createClaimLinkTransfert = async req => {
  const { link_id } = req.body;
  const link = await knex<Link>("links")
    .where({ uuid: link_id })
    .first();

  return {
    link_id: link.id,
    type: TypeLinkTransfert.claim,
    status: StatusLinkTransfert.on_hold,
    receiver_id: req.user.id,
    sender_id: link.user_id,
    receiver_delete: false,
    sender_delete: false
  };
};
const createGiveLinkTransfert = async req => {
  const { link_id, receiver_id, sender_id } = req.body;
  const link = await knex<Link>("links")
    .where({ uuid: link_id })
    .first();
  if (req.user.id !== link.user_id) {
    throw new CustomError("You are not the owner of this link.");
  }
  return {
    link_id: link.id,
    type: TypeLinkTransfert.give,
    status: StatusLinkTransfert.on_hold,
    receiver_id,
    sender_id: req.user.admin ? sender_id : req.user.id,
    receiver_delete: false,
    sender_delete: false
  };
};
const createLinkTransfert = async req => {
  const { type } = req.body;
  if (type === "claim") {
    return await createClaimLinkTransfert(req);
  } else {
    return await createGiveLinkTransfert(req);
  }
};

export const create: Handler = async (req, res) => {
  // Create new link
  const linkTransfertCreate = await createLinkTransfert(req);

  if (linkTransfertCreate.sender_id === linkTransfertCreate.receiver_id) {
    throw new CustomError("It is not possible to give a link to yourself.");
  }
  const linkTransfert = await query.linkTransfert.create(linkTransfertCreate);

  return res.status(201).send(linkTransfert);
};

export const edit: Handler = async (req, res) => {
  const { status } = req.body;
  const match = { id: parseInt(req.params.id, 10) };
  const [linkTransfert] = await query.linkTransfert.get(match);

  const [updatedLink] = await query.linkTransfert.update(
    {
      id: parseInt(req.params.id, 10)
    },
    {
      status
    }
  );

  if (status === "accept") {
    await query.link.update(
      {
        id: linkTransfert.link_id
      },
      {
        user_id: updatedLink.receiver_id
      }
    );
  }
  const match2 = { receiver_id: req.user.id };
  const linkTransfertGive = await query.linkTransfert.get(match2);
  // CLAIM
  const match3 = { sender_id: req.user.id };
  const linkTransfertClaim = await query.linkTransfert.get(match3);
  return res.status(200).send({ ...linkTransfertGive, ...linkTransfertClaim });
};
//DELETE

const softDeleteLinkTransfert = async (
  id: number,
  userKey: "receiver" | "sender"
) => {
  if (userKey === "receiver") {
    query.linkTransfert.update({ id }, { receiver_delete: true });
  } else {
    query.linkTransfert.update({ id }, { sender_delete: true });
  }
};

const patchStatusLinkTransfert = async (
  id: number,
  status: StatusLinkTransfert
) => {
  query.linkTransfert.update({ id }, { status: status.toString() });
};

const handleReceiverDelete = async linkTransfert => {
  const { status, type, id } = linkTransfert;
  if (status !== StatusLinkTransfert.on_hold) {
    return softDeleteLinkTransfert(id, "receiver");
  }
  if (type === TypeLinkTransfert.claim) {
    return patchStatusLinkTransfert(id, StatusLinkTransfert.refused); // function refuse()
  }
  // give
  return patchStatusLinkTransfert(id, StatusLinkTransfert.canceled); // function cancel()
};

const handleSenderDelete = async linkTransfert => {
  const { status, id, type } = linkTransfert;
  if (status !== StatusLinkTransfert.on_hold) {
    return softDeleteLinkTransfert(id, "sender");
  }
  if (type === TypeLinkTransfert.claim) {
    return patchStatusLinkTransfert(id, StatusLinkTransfert.canceled); // function cancel()
  }
  // give
  return patchStatusLinkTransfert(id, StatusLinkTransfert.refused); // function refuse()
};

export const remove: Handler = async (req, res) => {
  const { id } = req.body;
  const user_id = req.user.id;

  const linkTransfert = await query.linkTransfert.get({ id })[0];

  if (!linkTransfert) {
    throw new CustomError("Could not delete the link");
  }

  if (linkTransfert.receiver_id == user_id) {
    handleReceiverDelete(linkTransfert);
  } else {
    handleSenderDelete(linkTransfert);
  }
  return res
    .status(200)
    .send({ message: "Link has been deleted successfully." });
};

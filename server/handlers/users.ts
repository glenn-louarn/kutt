import query from "../queries";
import * as utils from "../utils";

export const get = async (req, res) => {
  const domains = await query.domain.get({ user_id: req.user.id });

  const data = {
    apikey: req.user.apikey,
    email: req.user.email,
    domains: domains.map(utils.sanitize.domain)
  };

  return res.status(200).send(data);
};

export const getAll = async (req, res) => {
  const { limit, skip } = req.query;
  const users = await query.user.getAll({ limit, skip });
  const data = [];
  users.forEach(user => {
    data.push(utils.sanitize.user(user));
  });
  return res.status(200).send({
    limit,
    skip,
    data
  });
};

export const remove = async (req, res) => {
  await query.user.remove(req.user);
  return res.status(200).send("OK");
};

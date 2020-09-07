import { Handler } from "express";
import query from "../queries";

// export const get: Handler = async (req, res) => {
//   const { limit, skip, search, all, searchable } = req.query;
//   const userId = req?.user?.id;

//   const searchableMatch = { searchable: true };
//   const tableMatch = {
//     ...(!all && userId !== undefined && { user_id: userId })
//   };
//   const match = searchable ? searchableMatch : tableMatch;

//   const [links, total] = await Promise.all([
//     query.link.get(match, { limit, search, skip }),
//     query.link.total(match, { search })
//   ]);

//   const data = links.map(utils.sanitize.link);

//   return res.send({
//     total,
//     limit,
//     skip,
//     data
//   });
// };

export const create: Handler = async (req, res) => {
  const { owner, newOwner, link_id } = req.body;

  // Create new link
  const status = "onHold";
  const linkChangeOwner = await query.linkChangeOwner.create({
    owner,
    newOwner,
    link_id,
    status
  });

  return res.status(201).send({ ...linkChangeOwner });
};

// export const edit: Handler = async (req, res) => {
//   const { address, target, description, searchable, expire_in } = req.body;

//   if (!address && !target) {
//     throw new CustomError("Should at least update one field.");
//   }

//   const link = await query.link.find({
//     uuid: req.params.id,
//     ...(!req.user.admin && { user_id: req.user.id })
//   });

//   if (!link) {
//     throw new CustomError("Link was not found.");
//   }

//   const targetDomain = URL.parse(target).hostname;
//   const domain_id = link.domain_id || null;

//   const queries = await Promise.all([
//     validators.cooldown(req.user),
//     validators.malware(req.user, target),
//     address !== link.address &&
//       query.link.find({
//         address,
//         user_id: req.user.id,
//         domain_id
//       }),
//     validators.bannedDomain(targetDomain),
//     validators.bannedHost(targetDomain)
//   ]);

//   // Check if custom link already exists
//   if (queries[2]) {
//     throw new CustomError("Custom URL is already in use.");
//   }

//   // Update link
//   const [updatedLink] = await query.link.update(
//     {
//       id: link.id
//     },
//     {
//       ...(address && { address }),
//       description,
//       ...(target && { target }),
//       ...(searchable !== undefined && { searchable }),
//       ...(expire_in && { expire_in })
//     }
//   );

//   return res.status(200).send(utils.sanitize.link({ ...link, ...updatedLink }));
// };

// export const remove: Handler = async (req, res) => {
//   const link = await query.link.remove({
//     uuid: req.params.id,
//     ...(!req.user.admin && { user_id: req.user.id })
//   });

//   if (!link) {
//     throw new CustomError("Could not delete the link");
//   }

//   return res
//     .status(200)
//     .send({ message: "Link has been deleted successfully." });
// };

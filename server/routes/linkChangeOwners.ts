import { Router } from "express";
import asyncHandler from "express-async-handler";
import cors from "cors";

// import * as validators from "../handlers/validators";
import * as helpers from "../handlers/helpers";
import * as linkChangeOwner from "../handlers/linkChangeOwners";
import * as auth from "../handlers/auth";
// import env from "../env";

const router = Router();

// router.get(
//   "/",
//   asyncHandler(auth.apikey),
//   asyncHandler(auth.jwtLoose),
//   helpers.query,
//   asyncHandler(auth.search),
//   asyncHandler(link.get)
// );

router.post(
  "/",
  cors(),
  asyncHandler(auth.apikey),
  asyncHandler(auth.jwt),
  asyncHandler(helpers.verify),
  asyncHandler(linkChangeOwner.create)
);

// router.patch(
//   "/:id",
//   asyncHandler(auth.apikey),
//   asyncHandler(auth.jwt),
//   validators.editLink,
//   asyncHandler(helpers.verify),
//   asyncHandler(link.edit)
// );

// router.delete(
//   "/:id",
//   asyncHandler(auth.apikey),
//   asyncHandler(auth.jwt),
//   validators.deleteLink,
//   asyncHandler(helpers.verify),
//   asyncHandler(link.remove)
// );
export default router;

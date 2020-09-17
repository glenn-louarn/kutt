import { Router } from "express";
import asyncHandler from "express-async-handler";
import cors from "cors";

// import * as validators from "../handlers/validators";
import * as helpers from "../handlers/helpers";
import * as linkTransfert from "../handlers/linkTransferts";
import * as auth from "../handlers/auth";
// import env from "../env";

const router = Router();

router.get(
  "/",
  asyncHandler(auth.apikey),
  asyncHandler(auth.jwt),
  asyncHandler(helpers.verify),
  asyncHandler(linkTransfert.get)
);

router.post(
  "/",
  cors(),
  asyncHandler(auth.apikey),
  asyncHandler(auth.jwt),
  asyncHandler(helpers.verify),
  asyncHandler(linkTransfert.create)
);

router.patch(
  "/:id",
  cors(),
  asyncHandler(auth.apikey),
  asyncHandler(auth.jwt),
  asyncHandler(helpers.verify),
  asyncHandler(linkTransfert.edit)
);

router.delete(
  "/:id",
  cors(),
  asyncHandler(auth.apikey),
  asyncHandler(auth.jwt),
  asyncHandler(helpers.verify),
  asyncHandler(linkTransfert.remove)
);
export default router;

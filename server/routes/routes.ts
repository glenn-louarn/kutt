import { Router } from "express";

import domains from "./domains";
import health from "./health";
import links from "./links";
import user from "./users";
import linkTransferts from "./linkTransferts";
import auth from "./auth";

const router = Router();

router.use("/domains", domains);
router.use("/health", health);
router.use("/links", links);
router.use("/users", user);
router.use("/linkTransferts", linkTransferts);
router.use("/auth", auth);

export default router;

import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(Role.TENANT), reviewController.createReview);
router.patch("/:id", auth(Role.TENANT), reviewController.updateReview);

export const reviewRoutes = router;

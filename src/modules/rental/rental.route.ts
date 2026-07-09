import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router();

router.post("/", auth(Role.TENANT), rentalController.submitRental);
router.get("/", auth(Role.TENANT), rentalController.myAllRentalRequest);
router.get("/:id", auth(Role.TENANT), rentalController.rentalDetails);

export const rentalRoutes = router;

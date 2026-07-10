import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { landlordController } from "./landlord.controller";

const router = Router();

router.post(
  "/properties",
  auth(Role.LANDLORD),
  landlordController.createProperty,
);

router.get("/properties", auth(Role.LANDLORD), landlordController.myProperties);

router.put(
  "/properties/:id",
  auth(Role.LANDLORD),
  landlordController.updateProperty,
);
router.delete(
  "/properties/:id",
  auth(Role.LANDLORD),
  landlordController.deleteProperty,
);
router.get(
  "/requests",
  auth(Role.LANDLORD),
  landlordController.allRentalRequestForProperties,
);
router.patch(
  "/requests/:id",
  auth(Role.LANDLORD),
  landlordController.approveOrRejectRequest,
);

router.patch(
  "/properties/status",
  auth(Role.LANDLORD),
  landlordController.changePropertyStatus,
);

router.get("/archive", auth(Role.LANDLORD), landlordController.rentalArchive);

export const landlordRoutes = router;

import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/create", auth(Role.TENANT), paymentController.createPayment);
router.post("/success/", paymentController.paymentSuccess);
// router.post("/fail/::trxID", paymentController.createPayment);
// router.post("/cancel/::trxID", paymentController.createPayment);

export const paymentRoutes = router;

import { Router } from "express";
import { propertyController } from "./property.controller";

const router = Router();

router.get("/", propertyController.getAllPropertyWithFilter);
router.get("/:id", propertyController.propertyDetails);

export const propertyRoutes = router;

import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";

import { authRoutes } from "./modules/auth/auth.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { landlordRoutes } from "./modules/landlord/landlord.route";
import { categoryRoutes } from "./modules/category/category.route";
import { rentalRoutes } from "./modules/rental/rental.route";
import { reviewRoutes } from "./modules/review/review.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { propertyRoutes } from "./modules/property/property.route";
import { paymentRoutes } from "./modules/payment/payment.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Rent Nest server is running");
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/payments", paymentRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;

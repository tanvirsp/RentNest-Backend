import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";

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
//app.use("/api/v1/users", userRoutes);

// app.use("/api/premium", (req: Request, res: Response) => {
//   res.send("This is Premium Payment Success URL");
// });

// app.use("/api/payment", (req: Request, res: Response) => {
//   res.send("This is Payment Fail URL");
// });

//app.use(notFound);
//app.use(globalErrorHandler);

export default app;

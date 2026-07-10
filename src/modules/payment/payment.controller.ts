import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { JwtPayload } from "jsonwebtoken";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalRequestId = req.body.rentalRequestId as string;
    const user = req.user as JwtPayload;

    const result = await paymentService.initiatePayment(rentalRequestId, user);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment submit successfully",
      data: result,
    });
  },
);

const paymentSuccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.paymentSuccess(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment Verify successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPayment,
  paymentSuccess,
};

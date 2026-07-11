import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { JwtPayload } from "jsonwebtoken";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalRequestId = req.body.rentalRequestId as string;

    if (!rentalRequestId) {
      throw new Error("Rental Request Id is required");
    }

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

const paymentFail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await paymentService.paymentFail(req.body);

    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Payment Fail",
      data: "",
    });
  },
);

const paymentCancel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Your payment has been cancel",
      data: "",
    });
  },
);

const paymentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const result = await paymentService.paymentHistory(tenantId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });
  },
);

const paymentDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.id as string;

    if (!paymentId) {
      throw new Error("Payment Id is required");
    }
    const result = await paymentService.paymentDetails(paymentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentHistory,
  paymentDetails,
};

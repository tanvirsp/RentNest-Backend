import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { reantalService } from "./rental.service";

const submitRental = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const payload = req.body;

    const result = await reantalService.submitRental(tenantId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request submit successfully",
      data: result,
    });
  },
);

const myAllRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const query = req.query;

    const result = await reantalService.myAllRentalRequest(tenantId, query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My Rental retrieved successfully",
      data: result,
    });
  },
);

const rentalDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const rentalId = req.params.id as string;

    const result = await reantalService.rentalDeatils(tenantId, rentalId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental details retrieved successfully",
      data: result,
    });
  },
);

export const rentalController = {
  submitRental,
  myAllRentalRequest,
  rentalDetails,
};

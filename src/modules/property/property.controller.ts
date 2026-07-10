import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { propertyService } from "./property.service";

const getAllPropertyWithFilter = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await propertyService.getAllPropertyWithFilter(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review added successfully",
      data: result,
    });
  },
);

const propertyDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;

    if (!propertyId) {
      throw new Error("Property Id is Required");
    }

    const result = await propertyService.propertyDetails(propertyId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property details retrieved successfully",
      data: result,
    });
  },
);

export const propertyController = { getAllPropertyWithFilter, propertyDetails };

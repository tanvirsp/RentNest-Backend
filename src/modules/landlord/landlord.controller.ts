import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordService } from "./landlord.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;
    const result = await landlordService.createProperty(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property created successfully",
      data: result,
    });
  },
);

const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;
    const payload = req.body;
    const result = await landlordService.updateProperty(propertyId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property update successfully",
      data: result,
    });
  },
);

const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const propertiesByLandlord = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const approveOrRejectRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const landlordController = {
  createProperty,
  updateProperty,
  deleteProperty,
  propertiesByLandlord,
  approveOrRejectRequest,
};

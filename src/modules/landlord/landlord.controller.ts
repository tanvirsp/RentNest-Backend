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

const myProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const result = await landlordService.myProperties(landlordId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieve successfully",
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
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;
    await landlordService.deleteProperty(propertyId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property delete successfully",
      data: {},
    });
  },
);

const allRentalRequestForProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const result =
      await landlordService.allRentalRequestForProperties(landlordId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All rental request retrieved successfully",
      data: result,
    });
  },
);

const approveOrRejectRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalId = req.params.id as string;
    const payload = req.body;

    const result = await landlordService.approveOrRejectRequest(
      rentalId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property request successfully",
      data: result,
    });
  },
);

const changePropertyStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const payload = req.body;

    const result = await landlordService.changePropertyStatus(
      landlordId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property status update successfully",
      data: result,
    });
  },
);
const rentalArchive = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;

    const result = await landlordService.rentalArchive(landlordId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All archive rent request retrieved successfully",
      data: result,
    });
  },
);

export const landlordController = {
  createProperty,
  myProperties,
  updateProperty,
  deleteProperty,
  allRentalRequestForProperties,
  approveOrRejectRequest,
  rentalArchive,
  changePropertyStatus,
};

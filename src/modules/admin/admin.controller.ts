import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: result,
    });
  },
);

const changeUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;

    if (!userId) {
      throw new Error("User Id is required");
    }

    const status = req.body;
    const result = await adminService.changeUserStatus(userId, status);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Status update successfully",
      data: result,
    });
  },
);

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllProperties();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All properties retrieved successfully",
      data: result,
    });
  },
);

const getAllRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllRentalRequest();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All rental request retrieved successfully",
      data: result,
    });
  },
);

export const adminController = {
  getAllUsers,
  changeUserStatus,
  getAllProperties,
  getAllRentalRequest,
};

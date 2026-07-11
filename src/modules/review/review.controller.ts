import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { reviewService } from "./review.service";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const payload = req.body;

    const result = await reviewService.createReview(tenantId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review added successfully",
      data: result,
    });
  },
);

const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const reviewId = req.params.id as string;

    if (!reviewId) {
      throw new Error("Review Id is required");
    }
    const payload = req.body;

    const result = await reviewService.updateReview(
      reviewId,
      tenantId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review update successfully",
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
  updateReview,
};

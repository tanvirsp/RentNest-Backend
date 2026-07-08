import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await categoryService.createCategory(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: result,
    });
  },
);

const allCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.allCategory();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category retrieved successfully",
      data: result,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId as string;
    const payload = req.body;
    const result = await categoryService.updateCategory(categoryId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category update successfully",
      data: result,
    });
  },
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId as string;
    await categoryService.deleteCategory(categoryId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category delete successfully",
      data: {},
    });
  },
);

const categoryById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const categoryController = {
  createCategory,
  updateCategory,
  deleteCategory,
  allCategory,
  categoryById,
};

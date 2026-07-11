import { prisma } from "../../lib/prisma";
import { IReview, IUpdateReview } from "./review.interface";

const createReview = async (tenantId: string, payload: IReview) => {
  const { rating, comment, rentalRequestId } = payload;

  const rentalRequstData = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
  });

  if (!rentalRequstData) {
    throw new Error("Rental request record not found");
  }

  if (rentalRequstData.status !== "COMPLETED") {
    throw new Error("Sorry you rent is not complated yet");
  }

  const result = await prisma.review.create({
    data: {
      rating,
      comment,
      tenantId,
      rentalRequestId: rentalRequstData.id,
      propertyId: rentalRequstData.propertyId,
    },
  });

  return result;
};

const updateReview = async (
  reviewId: string,
  tenantId: string,
  payload: IUpdateReview,
) => {
  const findReview = await prisma.review.findUnique({
    where: {
      id: reviewId,
      tenantId,
    },
  });

  if (!findReview) {
    throw new Error("Sorry review data is not found");
  }

  const result = await prisma.review.update({
    where: {
      id: reviewId,
      tenantId,
    },
    data: payload,
  });

  return result;
};

export const reviewService = {
  createReview,
  updateReview,
};

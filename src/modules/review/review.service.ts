import { prisma } from "../../lib/prisma";
import { IReview } from "./review.interface";

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

export const reviewService = {
  createReview,
};

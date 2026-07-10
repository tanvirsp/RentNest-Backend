import { prisma } from "../../lib/prisma";
import { IPayload, IRentalRequest } from "./rental.interface";

const submitRental = async (tenantId: string, payload: IRentalRequest) => {
  const propertyData = await prisma.property.findUnique({
    where: { id: payload.propertyId },
  });

  if (propertyData?.status !== "AVAILABLE") {
    throw new Error("Sorry property is not available");
  }

  const result = await prisma.rentalRequest.create({
    data: {
      ...payload,
      tenantId,
    },
  });

  return result;
};

const myAllRentalRequest = async (
  tenantId: string,
  query: Record<string, any>,
) => {
  const { status = "PENDING", page = "1", limit = "10" } = query;

  // Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Count
  const total = await prisma.rentalRequest.count({
    where: {
      tenantId,
      status,
    },
  });

  const result = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
      status,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limitNumber,
  });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },

    data: result,
  };
};

const rentalDeatils = async (tenantId: string, rentalId: string) => {
  const result = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalId,
      tenantId,
    },
    include: {
      reviews: {
        select: {
          rating: true,
          comment: true,
        },
      },
    },
  });

  return result;
};

export const reantalService = {
  submitRental,
  myAllRentalRequest,
  rentalDeatils,
};

import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./rental.interface";

const submitRental = async (tenantId: string, payload: IRentalRequest) => {
  const result = await prisma.rentalRequest.create({
    data: {
      ...payload,
      tenantId,
    },
  });

  return result;
};

const myAllRentalRequest = async (tenantId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: { tenantId },
  });

  return result;
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

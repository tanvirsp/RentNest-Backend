import {
  Property,
  RentalRequestStatus,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IUpdateProperty } from "./landlord.interface";

const createProperty = async (
  userId: string,
  payload: Omit<Property, "landlordId" | "createdAt" | "updatedAt">,
) => {
  // make amenities to lower case
  payload.amenities = payload.amenities.map((item) =>
    item.trim().toLowerCase(),
  );

  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId: userId,
    },
  });

  return result;
};

const updateProperty = async (propertyId: string, payload: IUpdateProperty) => {
  const result = await prisma.property.update({
    where: { id: propertyId },
    data: payload,
  });

  return result;
};

const deleteProperty = async (propertyId: string) => {
  await prisma.property.delete({ where: { id: propertyId } });
};

const allRentalRequestForProperties = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId: landlordId,
      },
      status: "PENDING",
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          rentAmount: true,
          city: true,
          images: true,
        },
      },
    },
  });

  return result;
};

const approveOrRejectRequest = async (
  rentalId: string,
  payload: { status: RentalRequestStatus },
) => {
  const isRentExit = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
  });

  if (!isRentExit) {
    throw new Error("Sorry this rental request not found");
  }

  const result = await prisma.rentalRequest.update({
    where: { id: rentalId },
    data: payload,
  });

  return result;
};

const rentalArchive = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId: landlordId,
      },
    },
    include: {
      reviews: true,
    },
  });

  return result;
};

const myProperties = async (landlordId: string) => {
  const result = await prisma.property.findMany({
    where: {
      landlordId,
    },
  });

  return result;
};

export const landlordService = {
  createProperty,
  updateProperty,
  deleteProperty,
  allRentalRequestForProperties,
  approveOrRejectRequest,
  rentalArchive,
  myProperties,
};

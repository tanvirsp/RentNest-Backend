import { Property } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IUpdateProperty } from "./landlord.interface";

const createProperty = async (
  userId: string,
  payload: Omit<Property, "landlordId | createdAt | updatedAt">,
) => {
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

const deleteProperty = async (payload: any) => {};
const propertiesByLandlord = async (payload: any) => {};
const approveOrRejectRequest = async (payload: any) => {};

export const landlordService = {
  createProperty,
  updateProperty,
  deleteProperty,
  propertiesByLandlord,
  approveOrRejectRequest,
};

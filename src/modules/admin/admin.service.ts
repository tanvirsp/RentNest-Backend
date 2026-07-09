import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });

  return result;
};

const changeUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: status,
  });

  return result;
};

const getAllProperties = async () => {
  const result = await prisma.property.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      reviews: true,
    },
  });
  return result;
};

const getAllRentalRequest = async () => {
  const result = await prisma.rentalRequest.findMany({
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

export const adminService = {
  getAllUsers,
  changeUserStatus,
  getAllProperties,
  getAllRentalRequest,
};

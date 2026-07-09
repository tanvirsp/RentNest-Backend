import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllPropertyWithFilter = async (query: Record<string, any>) => {
  const {
    searchTerm,
    city,
    category,
    amenities,
    minPrice,
    maxPrice,

    page = "1",
    limit = "10",

    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const andConditions: Prisma.PropertyWhereInput[] = [];
  // Search
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Location
  if (city) {
    andConditions.push({
      city: {
        equals: city,
        mode: "insensitive",
      },
    });
  }
  // Category
  if (category) {
    andConditions.push({
      category: {
        name: {
          equals: category,
          mode: "insensitive",
        },
      },
    });
  }
  // Price Range
  if (minPrice || maxPrice) {
    andConditions.push({
      rentAmount: {
        gte: minPrice ? new Prisma.Decimal(minPrice) : undefined,
        lte: maxPrice ? new Prisma.Decimal(maxPrice) : undefined,
      },
    });
  }
  // Amenities
  if (amenities) {
    const amenitiesArray = amenities
      .split(",")
      .map((item: string) => item.trim().toLowerCase());

    andConditions.push({
      amenities: {
        hasEvery: amenitiesArray,
      },
    });
  }

  const whereConditions: Prisma.PropertyWhereInput = {
    status: "AVAILABLE",
    ...(andConditions.length && {
      AND: andConditions,
    }),
  };

  // Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Count
  const total = await prisma.property.count({
    where: whereConditions,
  });

  console.log(andConditions);
  // Data
  const result = await prisma.property.findMany({
    where: whereConditions,
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
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

  //   end
};

const propertyDetails = async (propertyId: string) => {
  const result = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      reviews: true,
      landlord: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return result;
};

export const propertyService = { getAllPropertyWithFilter, propertyDetails };

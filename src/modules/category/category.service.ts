import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";

const createCategory = async (payload: ICategory) => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const allCategory = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const updateCategory = async (categoryId: string, payload: ICategory) => {
  const result = await prisma.category.update({
    where: { id: categoryId },
    data: { ...payload },
  });

  return result;
};
const deleteCategory = async (categoryId: string) => {
  const isExits = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!isExits) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });
};

export const categoryService = {
  createCategory,
  allCategory,
  updateCategory,
  deleteCategory,
};

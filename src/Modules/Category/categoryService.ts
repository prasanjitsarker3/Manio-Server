import { Prisma } from "@prisma/client";
import prisma from "../../App/Common/Prisma";
import paginationCalculation from "../../Utilities/paginationCalculation";
import { IPaginationOptions } from "../User/userInterface";
import { categorySearchingField, ICategory } from "./categoryInterface";
import { Request } from "express";
import { fileUploader } from "../../Helpers/fileUploader";

const createdCategory = async (req: Request) => {
  const files = req.file as any;
  let img;
  if (files) {
    const CloudImage = await fileUploader.uploadToCloudinary(files);
    img = CloudImage?.secure_url as string;
  }

  const category = JSON.parse(req.body.data);
  const result = await prisma.category.create({
    data: {
      name: category?.name || category,
      img: img as string,
    },
  });
  return result;
};

const getAllCategoryFormDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.CategoryWhereInput[] = [];
  if (params.searchTerm) {
    andCondition.push({
      OR: categorySearchingField.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  andCondition.push({
    isDeleted: false,
  });

  const whereCondition: Prisma.CategoryWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.category.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "asc",
          },
  });
  const total = await prisma.category.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const categoryDeletedFromDB = async (id: string) => {
  await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
  return result;
};

export const categoryService = {
  createdCategory,
  getAllCategoryFormDB,
  categoryDeletedFromDB,
};

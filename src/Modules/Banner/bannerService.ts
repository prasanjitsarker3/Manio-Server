import { Request } from "express";
import { fileUploader } from "../../Helpers/fileUploader";
import prisma from "../../App/Common/Prisma";
import { IPaginationOptions } from "../User/userInterface";
import paginationCalculation from "../../Utilities/paginationCalculation";
import { Prisma } from "@prisma/client";
import { categorySearchingField } from "../Category/categoryInterface";

const createBanner = async (req: Request) => {
  const files = req.file as any;
  let img;
  if (files) {
    const CloudImage = await fileUploader.uploadToCloudinary(files);
    img = CloudImage?.secure_url;
  }
  const banner = JSON.parse(req.body.data);
  const bannerData = {
    name: banner?.name || banner,
    img,
  };
  console.log(bannerData);
  const result = await prisma.banner.create({
    //@ts-ignore
    data: bannerData,
  });
  return result;
};
const getAllBanner = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.BannerWhereInput[] = [];
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

  const whereCondition: Prisma.BannerWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.banner.findMany({
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
  const total = await prisma.banner.count({
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

const bannerDelete = async (id: string) => {
  const result = await prisma.banner.delete({
    where: {
      id: id,
    },
  });
  return result;
};

export const bannerService = {
  createBanner,
  getAllBanner,
  bannerDelete,
};

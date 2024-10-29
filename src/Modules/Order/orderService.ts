import { OrderStatus, Prisma } from "@prisma/client";
import prisma from "../../App/Common/Prisma";
import paginationCalculation from "../../Utilities/paginationCalculation";
import { IPaginationOptions } from "../User/userInterface";
import {
  confirmOrderSearchingField,
  orderSearchingField,
} from "./orderInterface";

const createNewOrderInToDB = async (payload: any) => {
  const order = await prisma.order.create({
    data: {
      name: payload.name,
      address: payload.address,
      contact: payload.contact,
      note: payload.note || "",
      //@ts-ignore
      deliveryCharge: payload.deliveryCharge,
      totalPrice: payload.totalPrice,
      orderItems: {
        create: payload.productOrderData.map((item: any) => {
          console.log("Size Data:", item.size);
          return {
            quantity: item.quantity,
            // size: item.size.split(","),
            size: Array.isArray(item.size) ? item.size : [],
            product: {
              connect: { id: item.productId },
            },
          };
        }),
      },
    },
  });
  return order;
};

const getAllOrderFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm } = params;
  const andCondition: Prisma.OrderWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: orderSearchingField.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  andCondition.push({
    isDeleted: false,
  });
  andCondition.push({
    status: OrderStatus.PENDING,
  });

  const whereCondition: Prisma.OrderWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      address: true,
      contact: true,
      totalPrice: true,
      deliveryCharge: true,
      status: true,
      isPdf: true,
      createdAt: true,
      orderItems: {
        select: {
          id: true,
          quantity: true,
          size: true,
          product: {
            select: {
              name: true,
              price: true,
              photo: {
                select: {
                  id: true,
                  img: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
  const total = await prisma.order.count({
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

const getConfirmOrderFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.OrderWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: confirmOrderSearchingField.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  andCondition.push({
    status: OrderStatus.CONFIFM,
  });

  const whereCondition: Prisma.OrderWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      address: true,
      contact: true,
      totalPrice: true,
      deliveryCharge: true,
      status: true,
      createdAt: true,
      updateAt: true,
      orderItems: {
        select: {
          id: true,
          quantity: true,
          size: true,
          product: {
            select: {
              name: true,
              price: true,
              photo: {
                select: {
                  id: true,
                  img: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
  const total = await prisma.order.count({
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

const getDeliveryOrderFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.OrderWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: confirmOrderSearchingField.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  andCondition.push({
    status: OrderStatus.DELIVERY,
  });

  const whereCondition: Prisma.OrderWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      address: true,
      contact: true,
      totalPrice: true,
      deliveryCharge: true,
      status: true,
      createdAt: true,
      updateAt: true,
      orderItems: {
        select: {
          id: true,
          quantity: true,
          size: true,
          product: {
            select: {
              name: true,
              price: true,
              photo: {
                select: {
                  id: true,
                  img: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
  const total = await prisma.order.count({
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

const getSingleOrder = async (id: string) => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      address: true,
      contact: true,
      totalPrice: true,
      deliveryCharge: true,
      status: true,
      isPdf: true,
      createdAt: true,
      orderItems: {
        select: {
          id: true,
          quantity: true,
          size: true,
          product: {
            select: {
              name: true,
              price: true,
              photo: {
                select: {
                  id: true,
                  img: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
  return result;
};

const updateOrderStatus = async (orderId: string, payload: { status: any }) => {
  const orderData = await prisma.order.findUniqueOrThrow({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      orderItems: {
        select: {
          quantity: true,
          productId: true,
        },
      },
    },
  });

  if (payload.status === "CONFIFM" || payload.status === "DELIVERY") {
    for (const item of orderData.orderItems) {
      await prisma.product.update({
        where: {
          id: item.productId,
        },
        data: {
          sold: { increment: item.quantity },
          totalProduct: { decrement: item.quantity },
        },
      });
    }
  }

  const updateStatus = await prisma.order.update({
    where: {
      id: orderData.id,
    },
    data: {
      status: payload.status,
    },
  });
  return updateStatus;
};

const deleteOrderFromDB = async (orderProductId: string) => {
  const result = await prisma.$transaction(async (prisma) => {
    const orderData = await prisma.order.findUniqueOrThrow({
      where: {
        id: orderProductId,
      },
      select: {
        orderItems: true,
      },
    });

    const deletedOrderProducts = await prisma.orderProduct.deleteMany({
      where: {
        id: {
          in: orderData.orderItems.map((item) => item.id),
        },
      },
    });
    const deletedOrder = await prisma.order.delete({
      where: {
        id: orderProductId,
      },
    });

    return {
      deletedOrderProducts,
      deletedOrder,
    };
  });
  return result;
};

const isPDFDownloadFromDB = async (id: string) => {
  const orderData = await prisma.order.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  const result = await prisma.order.update({
    where: {
      id: orderData.id,
    },
    data: {
      isPdf: true,
    },
  });
  return result;
};

//Admin Data

const getAllOrderForAdmin = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm } = params;
  const andCondition: Prisma.OrderWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: orderSearchingField.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  andCondition.push({
    isDeleted: false,
  });

  const whereCondition: Prisma.OrderWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      address: true,
      contact: true,
      totalPrice: true,
      deliveryCharge: true,
      status: true,
      createdAt: true,
      orderItems: {
        select: {
          id: true,
          quantity: true,
          size: true,
          product: {
            select: {
              name: true,
              price: true,
              photo: {
                select: {
                  id: true,
                  img: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
  const total = await prisma.order.count({
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

export const orderService = {
  createNewOrderInToDB,
  getAllOrderFromDB,
  getConfirmOrderFromDB,
  getSingleOrder,
  updateOrderStatus,
  deleteOrderFromDB,
  isPDFDownloadFromDB,
  getDeliveryOrderFromDB,

  //Admin Route
  getAllOrderForAdmin,
};

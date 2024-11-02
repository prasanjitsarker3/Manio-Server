"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const client_1 = require("@prisma/client");
const Prisma_1 = __importDefault(require("../../App/Common/Prisma"));
const paginationCalculation_1 = __importDefault(require("../../Utilities/paginationCalculation"));
const orderInterface_1 = require("./orderInterface");
const createNewOrderInToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Prisma_1.default.order.create({
        data: {
            name: payload.name,
            address: payload.address,
            contact: payload.contact,
            note: payload.note || "",
            //@ts-ignore
            deliveryCharge: payload.deliveryCharge,
            totalPrice: payload.totalPrice,
            orderItems: {
                create: payload.productOrderData.map((item) => {
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
});
const getAllOrderFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationCalculation_1.default)(options);
    const { searchTerm } = params;
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: orderInterface_1.orderSearchingField.map((field) => ({
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
        status: client_1.OrderStatus.PENDING,
    });
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield Prisma_1.default.order.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
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
    const total = yield Prisma_1.default.order.count({
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
});
const getConfirmOrderFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationCalculation_1.default)(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: orderInterface_1.confirmOrderSearchingField.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    andCondition.push({
        status: client_1.OrderStatus.CONFIFM,
    });
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield Prisma_1.default.order.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
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
    const total = yield Prisma_1.default.order.count({
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
});
const getDeliveryOrderFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationCalculation_1.default)(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: orderInterface_1.confirmOrderSearchingField.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    andCondition.push({
        status: client_1.OrderStatus.DELIVERY,
    });
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield Prisma_1.default.order.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
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
    const total = yield Prisma_1.default.order.count({
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
});
const getSingleOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.order.findUnique({
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
});
const updateOrderStatus = (orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const orderData = yield Prisma_1.default.order.findUniqueOrThrow({
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
            yield Prisma_1.default.product.update({
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
    const updateStatus = yield Prisma_1.default.order.update({
        where: {
            id: orderData.id,
        },
        data: {
            status: payload.status,
        },
    });
    return updateStatus;
});
const deleteOrderFromDB = (orderProductId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const orderData = yield prisma.order.findUniqueOrThrow({
            where: {
                id: orderProductId,
            },
            select: {
                orderItems: true,
            },
        });
        const deletedOrderProducts = yield prisma.orderProduct.deleteMany({
            where: {
                id: {
                    in: orderData.orderItems.map((item) => item.id),
                },
            },
        });
        const deletedOrder = yield prisma.order.delete({
            where: {
                id: orderProductId,
            },
        });
        return {
            deletedOrderProducts,
            deletedOrder,
        };
    }));
    return result;
});
const isPDFDownloadFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const orderData = yield Prisma_1.default.order.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    const result = yield Prisma_1.default.order.update({
        where: {
            id: orderData.id,
        },
        data: {
            isPdf: true,
        },
    });
    return result;
});
//Admin Data
const getAllOrderForAdmin = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationCalculation_1.default)(options);
    const { searchTerm } = params;
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: orderInterface_1.orderSearchingField.map((field) => ({
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
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield Prisma_1.default.order.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
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
    const total = yield Prisma_1.default.order.count({
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
});
exports.orderService = {
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

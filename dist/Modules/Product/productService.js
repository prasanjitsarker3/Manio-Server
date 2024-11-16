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
exports.productService = void 0;
const fileUploader_1 = require("../../Helpers/fileUploader");
const Prisma_1 = __importDefault(require("../../App/Common/Prisma"));
const paginationCalculation_1 = __importDefault(require("../../Utilities/paginationCalculation"));
const client_1 = require("@prisma/client");
const productInterface_1 = require("./productInterface");
const createdNewProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const productData = JSON.parse(req.body.data);
    const { name, price, discount, totalProduct, size, type, categoryId, rating, description, delivery, } = productData;
    const formattedPrice = parseFloat(price);
    const formattedDiscount = discount ? parseFloat(discount) : 0;
    const formattedTotalProduct = parseInt(totalProduct, 10);
    //Update Rating
    const ratingFormate = parseInt(rating, 10);
    const finalPrice = formattedPrice - (formattedPrice * formattedDiscount) / 100;
    const files = req.files;
    let images = [];
    if (files && files.length > 0) {
        const cloudinaryImgs = yield Promise.all(files.map((file) => fileUploader_1.fileUploader.uploadToCloudinary(file)));
        images = cloudinaryImgs.map((img) => img.secure_url);
    }
    const newProduct = yield Prisma_1.default.product.create({
        data: {
            name,
            price: finalPrice,
            discount: formattedDiscount,
            totalProduct: formattedTotalProduct,
            size: size.split(","),
            type,
            categoryId,
            rating: ratingFormate,
            description: description,
            delivery: delivery,
            photo: {
                create: images.map((imgUrl) => ({
                    img: imgUrl,
                })),
            },
        },
        include: {
            photo: true,
        },
    });
    return newProduct;
});
const getAllProductFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationCalculation_1.default)(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
    if (params.searchTerm) {
        andCondition.push({
            OR: productInterface_1.productSearchingField.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    andCondition.push({
        isDelete: false,
    });
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield Prisma_1.default.product.findMany({
        where: whereCondition,
        include: {
            category: {
                select: {
                    name: true,
                },
            },
            photo: {
                select: {
                    id: true,
                    img: true,
                },
            },
        },
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: "asc",
            },
    });
    const total = yield Prisma_1.default.product.count({
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
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: id,
        },
        include: {
            category: {
                select: {
                    name: true,
                },
            },
            photo: {
                select: {
                    id: true,
                    img: true,
                },
            },
        },
    });
    return result;
});
const getSingleProductUpdate = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.data) {
        throw new Error("No data provided in the request body.");
    }
    let productData;
    try {
        productData = JSON.parse(req.body.data);
    }
    catch (error) {
        throw new Error("Invalid JSON format for product data.");
    }
    const { id, name, price, discount, totalProduct, size, oldImg } = productData;
    const formattedSize = Array.isArray(size)
        ? size
        : size.split(",").map((s) => s.trim());
    const files = req.files;
    const existingProduct = yield Prisma_1.default.product.findUnique({
        where: { id },
        include: { photo: true },
    });
    if (!existingProduct) {
        throw new Error("Product not found");
    }
    const existingPhotos = existingProduct.photo;
    const photosToKeep = oldImg.map((img) => img.id);
    const photosToDelete = existingPhotos.filter((photo) => !photosToKeep.includes(photo.id));
    if (photosToDelete.length > 0) {
        yield Promise.all(photosToDelete.map((photo) => __awaiter(void 0, void 0, void 0, function* () {
            yield Prisma_1.default.photo.delete({ where: { id: photo.id } });
        })));
    }
    let newImages = [];
    if (files && files.length > 0) {
        const uploadedImages = yield Promise.all(files.map((file) => fileUploader_1.fileUploader.uploadToCloudinary(file)));
        newImages = uploadedImages.map((img) => img.secure_url);
    }
    const formattedPrice = parseFloat(price);
    const formattedDiscount = discount ? parseFloat(discount) : 0;
    const finalPrice = formattedPrice - (formattedPrice * formattedDiscount) / 100;
    const updatedProduct = yield Prisma_1.default.product.update({
        where: { id },
        data: {
            name,
            price: finalPrice,
            discount: discount ? parseFloat(discount) : 0,
            totalProduct: parseInt(totalProduct, 10),
            size: formattedSize,
            photo: {
                create: newImages.map((imgUrl) => ({
                    img: imgUrl,
                })),
            },
        },
        include: { photo: true },
    });
    return updatedProduct;
});
const getSingleProductSoftDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.update({
        where: {
            id: id,
        },
        data: {
            isDelete: true,
        },
    });
    return result;
});
const topProductFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.findMany({
        where: {
            isDelete: false,
        },
        include: {
            photo: true,
        },
        orderBy: {
            sold: "desc",
        },
        take: 10,
    });
    return result;
});
const newProductFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.findMany({
        where: {
            isDelete: false,
        },
        include: {
            photo: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });
    return result;
});
const fetchTopDiscountedProductsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.findMany({
        where: {
            isDelete: false,
        },
        include: {
            photo: true,
        },
        orderBy: {
            discount: "desc",
        },
        take: 10,
    });
    return result;
});
const manFashionFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.findMany({
        where: {
            type: client_1.Gender.Man,
            isDelete: false,
        },
        include: {
            photo: true,
        },
        orderBy: {
            sold: "desc",
        },
    });
    return result;
});
const womanFashionFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.findMany({
        where: {
            type: client_1.Gender.Woman,
            isDelete: false,
        },
        include: {
            photo: true,
        },
        orderBy: {
            sold: "desc",
        },
    });
    return result;
});
const cartFilteringData = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.findMany({
        where: {
            isDelete: false,
        },
        include: {
            category: {
                select: {
                    name: true,
                },
            },
            photo: {
                select: {
                    id: true,
                    img: true,
                },
            },
        },
    });
    return result;
});
exports.productService = {
    createdNewProduct,
    getAllProductFromDB,
    getSingleProduct,
    getSingleProductUpdate,
    getSingleProductSoftDelete,
    topProductFromDB,
    newProductFromDB,
    fetchTopDiscountedProductsFromDB,
    manFashionFromDB,
    womanFashionFromDB,
    cartFilteringData,
};

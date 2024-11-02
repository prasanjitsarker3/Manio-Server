"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../Helpers/fileUploader");
const productController_1 = require("./productController");
const auth_1 = __importDefault(require("../../Middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", productController_1.productController.getAllProduct);
router.get("/topProduct", productController_1.productController.getTopProduct);
router.get("/newProduct", productController_1.productController.getNewProduct);
router.get("/discountProduct", productController_1.productController.topDiscountProduct);
router.get("/manFashion", productController_1.productController.manFashionFromDB);
router.get("/womanFashion", productController_1.productController.womanFashionFromDB);
router.get("/cartFiltering", productController_1.productController.cartFilteringData);
router.get("/:productId", productController_1.productController.getSingleProduct);
router.post("/create", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.user), fileUploader_1.fileUploader.upload.array("file"), productController_1.productController.createProduct);
router.post("/update", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.user), fileUploader_1.fileUploader.upload.array("file"), productController_1.productController.getSingleProductUpdate);
router.patch("/:deleteId", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.user), productController_1.productController.getSingleProductDelete);
exports.productRoutes = router;

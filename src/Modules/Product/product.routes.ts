import express from "express";
import { fileUploader } from "../../Helpers/fileUploader";
import { productController } from "./productController";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", productController.getAllProduct);
router.get("/topProduct", productController.getTopProduct);
router.get("/newProduct", productController.getNewProduct);
router.get("/discountProduct", productController.topDiscountProduct);
router.get("/manFashion", productController.manFashionFromDB);
router.get("/womanFashion", productController.womanFashionFromDB);
router.get("/cartFiltering", productController.cartFilteringData);
router.get("/:productId", productController.getSingleProduct);

router.post(
  "/create",
  auth(UserRole.admin, UserRole.user),
  fileUploader.upload.array("file"),
  productController.createProduct
);

router.post(
  "/update",
  auth(UserRole.admin, UserRole.user),
  fileUploader.upload.array("file"),
  productController.getSingleProductUpdate
);
router.patch(
  "/:deleteId",
  auth(UserRole.admin, UserRole.user),
  productController.getSingleProductDelete
);

export const productRoutes = router;

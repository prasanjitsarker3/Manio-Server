"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("./categoryController");
const fileUploader_1 = require("../../Helpers/fileUploader");
const auth_1 = __importDefault(require("../../Middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/created", (0, auth_1.default)(client_1.UserRole.admin), fileUploader_1.fileUploader.upload.single("file"), categoryController_1.categoryController.createdCategory);
router.get("", categoryController_1.categoryController.allCategory);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.admin), categoryController_1.categoryController.deletedCategory);
exports.categoryRoutes = router;

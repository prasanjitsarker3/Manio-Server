"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = __importDefault(require("../../Middleware/validationRequest"));
const authValidation_1 = require("./authValidation");
const authController_1 = require("./authController");
const auth_1 = __importDefault(require("../../Middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/register", (0, auth_1.default)(client_1.UserRole.admin), authController_1.authController.userRegister);
router.post("/login", (0, validationRequest_1.default)(authValidation_1.userLoginSchema), authController_1.authController.userLogin);
router.post("/refreshToken", authController_1.authController.refreshToken);
router.post("/change-password", 
// auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN, UserRole.USER),
authController_1.authController.changePassword);
exports.authRoutes = router;

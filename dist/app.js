"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./Routes/routes"));
const globalErrorHandler_1 = __importDefault(require("./Middleware/globalErrorHandler"));
const notFound_1 = __importDefault(require("./Middleware/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = require("./Lib/cors");
const app = (0, express_1.default)();
// Apply custom CORS middleware globally
app.use(cors_1.cors);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send({
        Message: "Server Running",
    });
});
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
